-- Chạy trong Supabase Dashboard → SQL Editor (hoặc `supabase db push`).
-- Bật Auth → Anonymous (tuỳ chọn, cho demo không cần email) và Email → Magic link.

create extension if not exists "pgcrypto";

create table if not exists public.transcript_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  title text,
  created_at timestamptz not null default now()
);

alter table public.transcript_sessions
  add column if not exists transcript text not null default '';

create table if not exists public.transcript_segments (
  id bigint generated always as identity primary key,
  session_id uuid not null references public.transcript_sessions (id) on delete cascade,
  text text not null,
  is_final boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists transcript_segments_session_id_idx
  on public.transcript_segments (session_id);

create index if not exists transcript_sessions_user_id_created_idx
  on public.transcript_sessions (user_id, created_at desc);

alter table public.transcript_sessions enable row level security;
alter table public.transcript_segments enable row level security;

drop policy if exists "open_transcript_sessions" on public.transcript_sessions;
drop policy if exists "open_transcript_segments" on public.transcript_segments;
drop policy if exists "sess_select_own" on public.transcript_sessions;
drop policy if exists "sess_insert_own" on public.transcript_sessions;
drop policy if exists "seg_select_own" on public.transcript_segments;
drop policy if exists "seg_insert_own" on public.transcript_segments;
drop policy if exists "seg_update_own" on public.transcript_segments;
drop policy if exists "seg_delete_own" on public.transcript_segments;

/* (select auth.uid()) — initplan-friendly; xem Supabase database linter auth_rls_initplan */
create policy "sess_select_own"
  on public.transcript_sessions
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "sess_insert_own"
  on public.transcript_sessions
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "seg_select_own"
  on public.transcript_segments
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.transcript_sessions s
      where s.id = transcript_segments.session_id
        and s.user_id = (select auth.uid())
    )
  );

create policy "seg_insert_own"
  on public.transcript_segments
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.transcript_sessions s
      where s.id = transcript_segments.session_id
        and s.user_id = (select auth.uid())
    )
  );

create policy "seg_update_own"
  on public.transcript_segments
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.transcript_sessions s
      where s.id = transcript_segments.session_id
        and s.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.transcript_sessions s
      where s.id = transcript_segments.session_id
        and s.user_id = (select auth.uid())
    )
  );

create policy "seg_delete_own"
  on public.transcript_segments
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.transcript_sessions s
      where s.id = transcript_segments.session_id
        and s.user_id = (select auth.uid())
    )
  );
