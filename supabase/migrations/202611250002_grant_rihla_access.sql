-- Let administrators activate registered accounts that have no payment request row.
create or replace function public.grant_rihla_access(target_user uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare selected_plan text;
begin
  if not public.is_rihla_admin() then raise exception 'Admin access required'; end if;

  select case when plan = 'yearly' then 'yearly' else 'monthly' end
    into selected_plan
    from public.profiles
    where id = target_user;
  if selected_plan is null then raise exception 'User profile not found'; end if;

  insert into public.entitlements (user_id, active, plan, granted_at, granted_by)
    values (target_user, true, selected_plan, now(), auth.uid())
    on conflict (user_id) do update
      set active = true, plan = excluded.plan, granted_at = now(), granted_by = auth.uid();
end;
$$;

revoke all on function public.grant_rihla_access(uuid) from public, anon;
grant execute on function public.grant_rihla_access(uuid) to authenticated;
