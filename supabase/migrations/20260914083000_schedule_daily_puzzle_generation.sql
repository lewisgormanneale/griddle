-- Schedules the generate-daily-puzzle Edge Function to run at midnight UTC
-- every day via Supabase's pg_cron + pg_net integration.
--
-- One-time manual setup this migration cannot do for you (it would leak a
-- secret into git history otherwise): store the project's service role key
-- in Supabase Vault, from the SQL editor, ONE TIME:
--
--   select vault.create_secret('<your-service-role-key>', 'service_role_key');
--
-- The service role key is under Project Settings -> API. Until that secret
-- exists, this scheduled job will run but fail with an auth error - check
-- Database -> Cron -> generate-daily-puzzle -> Run history, or the Edge
-- Function logs, after setup.

create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

-- Re-running this migration should not create duplicate schedules.
do $$
begin
  if exists (select 1 from cron.job where jobname = 'generate-daily-puzzle') then
    perform cron.unschedule('generate-daily-puzzle');
  end if;
end $$;

select
  cron.schedule(
    'generate-daily-puzzle',
    '0 0 * * *', -- midnight UTC, every day. Adjust if you want a different local midnight.
    $$
    select
      net.http_post(
        url := 'https://eebmtscbnqdooktanwnj.supabase.co/functions/v1/generate-daily-puzzle',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || (
            select decrypted_secret
            from vault.decrypted_secrets
            where name = 'service_role_key'
          )
        ),
        body := '{}'::jsonb
      );
    $$
  );
