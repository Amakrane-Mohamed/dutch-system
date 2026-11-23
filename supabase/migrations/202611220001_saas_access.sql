-- Rihla paid access: users request access after a manual transfer; only the owner can grant it.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.access_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payment_method text not null check (char_length(payment_method) between 2 and 80),
  payment_reference text not null check (char_length(payment_reference) between 2 and 500),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id)
);
create unique index if not exists one_pending_rihla_request_per_user
  on public.access_requests(user_id) where status = 'pending';

create table if not exists public.entitlements (
  user_id uuid primary key references auth.users(id) on delete cascade,
  active boolean not null default false,
  plan text not null default 'Rihla Plus',
  granted_at timestamptz not null default now(),
  granted_by uuid references auth.users(id)
);

create table if not exists public.learning_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb check (jsonb_typeof(state) = 'object'),
  updated_at timestamptz not null default now()
);

create or replace function public.is_rihla_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.profiles where id = auth.uid() and is_admin = true)
$$;

create or replace function public.create_rihla_profile()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;
drop trigger if exists rihla_profile_after_signup on auth.users;
create trigger rihla_profile_after_signup after insert or update of email on auth.users
for each row execute function public.create_rihla_profile();

insert into public.profiles (id, email)
  select id, email from auth.users
  on conflict (id) do update set email = excluded.email;

create or replace function public.review_rihla_access_request(request_id uuid, decision text)
returns void language plpgsql security definer set search_path = '' as $$
declare target_user uuid;
begin
  if not public.is_rihla_admin() then raise exception 'Admin access required'; end if;
  if decision not in ('approved', 'rejected') then raise exception 'Invalid decision'; end if;
  update public.access_requests set status = decision, reviewed_at = now(), reviewed_by = auth.uid()
    where id = request_id and status = 'pending' returning user_id into target_user;
  if target_user is null then raise exception 'Pending request not found'; end if;
  if decision = 'approved' then
    insert into public.entitlements (user_id, active, granted_at, granted_by)
      values (target_user, true, now(), auth.uid())
      on conflict (user_id) do update set active = true, granted_at = now(), granted_by = auth.uid();
  end if;
end;
$$;

alter table public.profiles enable row level security;
alter table public.access_requests enable row level security;
alter table public.entitlements enable row level security;
alter table public.learning_progress enable row level security;

create policy "Profiles visible to owner or admin" on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_rihla_admin());
create policy "Users can insert their own pending request" on public.access_requests for insert to authenticated
  with check (user_id = auth.uid() and status = 'pending');
create policy "Requests visible to owner or admin" on public.access_requests for select to authenticated
  using (user_id = auth.uid() or public.is_rihla_admin());
create policy "Entitlements visible to owner or admin" on public.entitlements for select to authenticated
  using (user_id = auth.uid() or public.is_rihla_admin());
create policy "Users manage their own learning progress" on public.learning_progress for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
revoke all on public.access_requests from anon, authenticated;
grant select, insert on public.access_requests to authenticated;
revoke all on public.entitlements from anon, authenticated;
grant select on public.entitlements to authenticated;
revoke all on public.learning_progress from anon, authenticated;
grant select, insert, update on public.learning_progress to authenticated;
revoke all on function public.review_rihla_access_request(uuid, text) from public, anon;
grant execute on function public.review_rihla_access_request(uuid, text) to authenticated;
revoke all on function public.is_rihla_admin() from public, anon;
grant execute on function public.is_rihla_admin() to authenticated;

-- After your first signup, set the account owner from the Supabase SQL editor:
-- update public.profiles set is_admin = true where email = 'you@example.com';
