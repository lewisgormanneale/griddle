-- Marks a nonogram as the generated puzzle for a specific calendar date, so the
-- site can look up "today's puzzle" without depending on hardcoded ids or titles.
alter table public.nonograms
  add column if not exists daily_date date;

-- Postgres treats each NULL as distinct, so this still allows any number of
-- non-daily nonograms (daily_date is null) while guaranteeing at most one
-- daily puzzle per calendar date. The index also makes "today's puzzle" and
-- "most recent daily puzzle" lookups fast.
create unique index if not exists nonograms_daily_date_key
  on public.nonograms (daily_date)
  where daily_date is not null;
