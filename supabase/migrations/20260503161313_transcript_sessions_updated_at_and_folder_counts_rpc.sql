/* Applied on remote via Supabase MCP — keep in sync with Dashboard migrations. */
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
