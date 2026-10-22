-- Optional: run once in Supabase → SQL Editor. Then put the project URL and the
-- publishable (anon) key in js/config.js. The table itself stays closed (RLS, no policies);
-- the page can only ask "was this text used?" and "mark it used", nothing else.

create table if not exists public.used_reviews (
  hash       text primary key check (length(hash) between 8 and 64),
  stars      smallint check (stars between 1 and 5),
  created_at timestamptz not null default now()
);
alter table public.used_reviews enable row level security;

create or replace function public.review_is_used(h text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from used_reviews where hash = h);
$$;

create or replace function public.review_claim(h text, s int)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  insert into used_reviews (hash, stars) values (h, s) on conflict (hash) do nothing;
  return found;
end;
$$;

revoke all on function public.review_is_used(text) from public;
revoke all on function public.review_claim(text, int) from public;
grant execute on function public.review_is_used(text) to anon, authenticated;
grant execute on function public.review_claim(text, int) to anon, authenticated;
