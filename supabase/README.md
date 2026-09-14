# Supabase: daily puzzle generation

This project's schema and edge functions weren't previously tracked in git -
they were built directly in the Supabase dashboard. This folder starts
bringing that under version control, beginning with what's needed for
automatic daily puzzles. Everything below needs to be applied to the live
project by someone with access (I don't have credentials for it from here).

## What's here

- `migrations/20260914082419_add_daily_puzzle_support.sql` - adds a
  `nonograms.daily_date` column (nullable, unique when set) used to mark
  "the" puzzle for a given calendar date.
- `functions/generate-daily-puzzle/` - an Edge Function that, for a given
  date (default: today, UTC):
  1. Skips if a daily puzzle for that date already exists (idempotent).
  2. Finds or creates a pack named e.g. `"June 2026 Daily Challenge"`.
  3. Generates a random 15x15 solution and checks it's solvable by pure line
     logic alone (no guessing) using the same solver the manual puzzle
     creator uses (`utils/nonogram/logic-solver.ts`), retrying with varied
     fill density until one passes. In testing this typically succeeds
     within single-digit milliseconds.
  4. Inserts the nonogram + its row/column hints.
- `migrations/20260914083000_schedule_daily_puzzle_generation.sql` - wires
  the function up to run every day at **midnight UTC** via pg_cron + pg_net.
  Adjust the cron expression if you want a different timezone's midnight.
- `config.toml` - minimal Supabase CLI config (project ref + function auth
  setting).

## One-time deploy steps

From the repo root, with the Supabase CLI (already a dependency, so
`npx supabase ...` works):

```bash
npx supabase login
npx supabase link --project-ref eebmtscbnqdooktanwnj
npx supabase db push              # applies both migrations above
npx supabase functions deploy generate-daily-puzzle
```

Then, **one time**, in the Supabase SQL editor, store the service role key
(Project Settings -> API -> `service_role` secret) in Vault so the scheduled
job can authenticate as the function invokes it server-to-server:

```sql
select vault.create_secret('<your-service-role-key>', 'service_role_key');
```

Never commit the actual key anywhere - that's why it goes into Vault via the
dashboard rather than into a migration file.

## Alternative: no SQL, using the dashboard Cron UI

If you'd rather not touch pg_cron/Vault directly, Supabase's dashboard has a
**Database -> Cron** page where you can schedule "Invoke an Edge Function"
jobs by pointing-and-clicking (it fills in the auth header for you). Skip
the second migration in that case, and just:
1. Deploy the migration that adds `daily_date` (`npx supabase db push`, or
   just run that one file's SQL in the SQL editor).
2. Deploy the function (`npx supabase functions deploy generate-daily-puzzle`).
3. Create the Cron job in the dashboard, schedule `0 0 * * *`.

## Testing it manually

Once deployed, you can trigger a run by hand (useful for testing, or to
backfill a missing day) - here `<date>` is optional and defaults to today:

```bash
curl -X POST 'https://eebmtscbnqdooktanwnj.supabase.co/functions/v1/generate-daily-puzzle' \
  -H "Authorization: Bearer <service-role-key>" \
  -H "Content-Type: application/json" \
  -d '{"date": "2026-06-01"}'
```

## Recommendation: track the rest of the schema too

Right now only the `daily_date` column is under version control - the rest
of the schema (tables, RLS policies, etc.) still lives only in the live
project. Worth running `npx supabase db pull` at some point (with the
project linked) to capture a baseline migration for everything else, so
future schema changes go through the same review-and-migrate flow as this
one did.
