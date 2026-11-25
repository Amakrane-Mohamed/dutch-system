-- Keep deployments with an older access_requests table compatible with plan-aware requests.
alter table public.access_requests
  add column if not exists plan text not null default 'monthly';

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'access_requests_plan_allowed') then
    alter table public.access_requests
      add constraint access_requests_plan_allowed check (plan in ('monthly', 'yearly'));
  end if;
end $$;
