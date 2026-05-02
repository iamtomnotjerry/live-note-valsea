-- Chạy trong Supabase Dashboard → SQL Editor.
-- Cảnh báo: các policy cuối file cho phép mọi request (phù hợp dev/hackathon).
-- Production: bỏ policy “open”, thay bằng auth.uid() + kiểm tra kỹ.

create extension if not exists "pgcrypto";

create table if not exists public.transcript_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  title text,
  created_at timestamptz not null default now()
);

create table if not exists public.transcript_segments (
  id bigint generated always as identity primary key,
  session_id uuid not null references public.transcript_sessions (id) on delete cascade,
  text text not null,
  is_final boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists transcript_segments_session_id_idx
  on public.transcript_segments (session_id);

alter table public.transcript_sessions enable row level security;
alter table public.transcript_segments enable row level security;

drop policy if exists "open_transcript_sessions" on public.transcript_sessions;
drop policy if exists "open_transcript_segments" on public.transcript_segments;

-- Dev / hackathon: mở full cho role anon + authenticated. Thu hẹp trước khi public thật.
create policy "open_transcript_sessions"
  on public.transcript_sessions
  for all
  using (true)
  with check (true);

create policy "open_transcript_segments"
  on public.transcript_segments
  for all
  using (true)
  with check (true);
