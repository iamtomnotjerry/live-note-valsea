/* Harden trigger function for Supabase linter (function_search_path_mutable). */
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
