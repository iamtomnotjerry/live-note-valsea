import type { User } from "@supabase/supabase-js";

export function profileDisplayName(user: User): string | null {
  const meta = user.user_metadata as Record<string, string | undefined>;
  const raw = (meta.full_name ?? meta.name ?? "").trim();
  return raw || null;
}

export function profileAvatarUrl(user: User): string | undefined {
  const meta = user.user_metadata as Record<string, string | undefined>;
  return meta.avatar_url ?? meta.picture;
}
