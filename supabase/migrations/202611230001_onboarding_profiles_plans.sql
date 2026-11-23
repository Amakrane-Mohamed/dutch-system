-- Store signup details and the plan submitted for manual payment review.
alter table public.profiles
  add column if not exists first_name text,
  add column if not exists family_name text,
  add column if not exists full_name text,
  add column if not exists age integer,
  add column if not exists city text,
  add column if not exists goal_level text,
  add column if not exists phone text,
  add column if not exists plan text not null default 'monthly';

alter table public.access_requests
  add column if not exists plan text not null default 'monthly';

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_age_range') then
    alter table public.profiles add constraint profiles_age_range check (age is null or age between 13 and 100);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'profiles_goal_level_allowed') then
    alter table public.profiles add constraint profiles_goal_level_allowed check (goal_level is null or goal_level in ('A1','A2','B1','B2','C1'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'profiles_plan_allowed') then
    alter table public.profiles add constraint profiles_plan_allowed check (plan in ('monthly','yearly'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'access_requests_plan_allowed') then
    alter table public.access_requests add constraint access_requests_plan_allowed check (plan in ('monthly','yearly'));
  end if;
end $$;

create or replace function public.create_rihla_profile()
returns trigger language plpgsql security definer set search_path = '' as $$
declare meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
begin
  insert into public.profiles (id, email, first_name, family_name, full_name, age, city, goal_level, phone, plan)
  values (
    new.id,
    new.email,
    nullif(meta ->> 'first_name', ''),
    nullif(meta ->> 'family_name', ''),
    nullif(meta ->> 'full_name', ''),
    case when coalesce(meta ->> 'age', '') ~ '^[0-9]+$' then (meta ->> 'age')::integer else null end,
    nullif(meta ->> 'city', ''),
    case when meta ->> 'goal_level' in ('A1','A2','B1','B2','C1') then meta ->> 'goal_level' else null end,
    nullif(meta ->> 'phone', ''),
    case when meta ->> 'plan' in ('monthly','yearly') then meta ->> 'plan' else 'monthly' end
  )
  on conflict (id) do update set
    email = excluded.email,
    first_name = coalesce(excluded.first_name, public.profiles.first_name),
    family_name = coalesce(excluded.family_name, public.profiles.family_name),
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    age = coalesce(excluded.age, public.profiles.age),
    city = coalesce(excluded.city, public.profiles.city),
    goal_level = coalesce(excluded.goal_level, public.profiles.goal_level),
    phone = coalesce(excluded.phone, public.profiles.phone),
    plan = coalesce(excluded.plan, public.profiles.plan);
  return new;
end;
$$;

insert into public.profiles (id, email, first_name, family_name, full_name, age, city, goal_level, phone, plan)
select
  id,
  email,
  nullif(raw_user_meta_data ->> 'first_name', ''),
  nullif(raw_user_meta_data ->> 'family_name', ''),
  nullif(raw_user_meta_data ->> 'full_name', ''),
  case when coalesce(raw_user_meta_data ->> 'age', '') ~ '^[0-9]+$' then (raw_user_meta_data ->> 'age')::integer else null end,
  nullif(raw_user_meta_data ->> 'city', ''),
  case when raw_user_meta_data ->> 'goal_level' in ('A1','A2','B1','B2','C1') then raw_user_meta_data ->> 'goal_level' else null end,
  nullif(raw_user_meta_data ->> 'phone', ''),
  case when raw_user_meta_data ->> 'plan' in ('monthly','yearly') then raw_user_meta_data ->> 'plan' else 'monthly' end
from auth.users
on conflict (id) do update set
  email = excluded.email,
  first_name = coalesce(excluded.first_name, public.profiles.first_name),
  family_name = coalesce(excluded.family_name, public.profiles.family_name),
  full_name = coalesce(excluded.full_name, public.profiles.full_name),
  age = coalesce(excluded.age, public.profiles.age),
  city = coalesce(excluded.city, public.profiles.city),
  goal_level = coalesce(excluded.goal_level, public.profiles.goal_level),
  phone = coalesce(excluded.phone, public.profiles.phone),
  plan = coalesce(excluded.plan, public.profiles.plan);

create or replace function public.review_rihla_access_request(request_id uuid, decision text)
returns void language plpgsql security definer set search_path = '' as $$
declare target_user uuid; target_plan text;
begin
  if not public.is_rihla_admin() then raise exception 'Admin access required'; end if;
  if decision not in ('approved', 'rejected') then raise exception 'Invalid decision'; end if;
  update public.access_requests set status = decision, reviewed_at = now(), reviewed_by = auth.uid()
    where id = request_id and status = 'pending' returning user_id, plan into target_user, target_plan;
  if target_user is null then raise exception 'Pending request not found'; end if;
  if decision = 'approved' then
    insert into public.entitlements (user_id, active, plan, granted_at, granted_by)
      values (target_user, true, target_plan, now(), auth.uid())
      on conflict (user_id) do update set active = true, plan = excluded.plan, granted_at = now(), granted_by = auth.uid();
  end if;
end;
$$;
