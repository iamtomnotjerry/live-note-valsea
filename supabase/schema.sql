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

/* Folders: group saved sessions (“files”) per user. */
create table if not exists public.note_folders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  constraint note_folders_name_len check (
    char_length(trim(name)) > 0
    and char_length(name) <= 120
  )
);

create index if not exists note_folders_user_id_name_idx
  on public.note_folders (user_id, lower(name));

create index if not exists note_folders_user_id_created_idx
  on public.note_folders (user_id, created_at desc);

alter table public.note_folders enable row level security;

drop policy if exists "folder_select_own" on public.note_folders;
drop policy if exists "folder_insert_own" on public.note_folders;
drop policy if exists "folder_update_own" on public.note_folders;
drop policy if exists "folder_delete_own" on public.note_folders;

create policy "folder_select_own"
  on public.note_folders
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "folder_insert_own"
  on public.note_folders
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "folder_update_own"
  on public.note_folders
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "folder_delete_own"
  on public.note_folders
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

alter table public.transcript_sessions
  add column if not exists folder_id uuid references public.note_folders (id) on delete set null;

create index if not exists transcript_sessions_folder_id_idx
  on public.transcript_sessions (folder_id)
  where folder_id is not null;

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
  with check (
    (select auth.uid()) = user_id
    and (
      folder_id is null
      or exists (
        select 1
        from public.note_folders f
        where
          f.id = transcript_sessions.folder_id
          and f.user_id = (select auth.uid())
      )
    )
  );

drop policy if exists "sess_update_own" on public.transcript_sessions;
drop policy if exists "sess_delete_own" on public.transcript_sessions;

create policy "sess_update_own"
  on public.transcript_sessions
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and (
      folder_id is null
      or exists (
        select 1
        from public.note_folders f
        where
          f.id = transcript_sessions.folder_id
          and f.user_id = (select auth.uid())
      )
    )
  );

create policy "sess_delete_own"
  on public.transcript_sessions
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

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

/* Last edit time (UI + sorting); maintained on UPDATE. */
alter table public.transcript_sessions
  add column if not exists updated_at timestamptz not null default now();

create or replace function public.transcript_sessions_set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_transcript_sessions_set_updated_at on public.transcript_sessions;
create trigger trg_transcript_sessions_set_updated_at
  before update on public.transcript_sessions
  for each row
  execute function public.transcript_sessions_set_updated_at();

/* One round-trip for folder card counts (replaces fetching every session row). */
create or replace function public.note_counts_by_folder_for_user()
returns table (folder_id uuid, note_count bigint)
language sql
stable
security invoker
set search_path = public
as $$
  select t.folder_id, count(*)::bigint
  from public.transcript_sessions t
  where t.user_id = (select auth.uid())
  group by t.folder_id;
$$;

grant execute on function public.note_counts_by_folder_for_user() to authenticated;
