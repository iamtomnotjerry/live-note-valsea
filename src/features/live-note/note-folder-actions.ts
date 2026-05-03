"use server";

import { z } from "zod";
import { revalidateProfileTree } from "@/features/profile/revalidate-profile-tree";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type NoteFolderRow = { id: string; name: string };

export type ListNoteFoldersResult =
  | { ok: true; folders: NoteFolderRow[] }
  | { ok: false; code: "AUTH" | "DB"; message?: string };

const folderNameSchema = z.string().trim().min(1).max(120);

export async function listNoteFolders(): Promise<ListNoteFoldersResult> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: true, folders: [] };

  const { data, error } = await supabase
    .from("note_folders")
    .select("id, name")
    .eq("user_id", user.id)
    .order("name", { ascending: true });

  if (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[listNoteFolders]", error.message);
    }
    return { ok: false, code: "DB", message: error.message };
  }

  return { ok: true, folders: (data ?? []) as NoteFolderRow[] };
}

export async function createNoteFolder(
  rawName: string,
): Promise<{ ok: true; id: string } | { ok: false; message: string }> {
  const parsed = folderNameSchema.safeParse(rawName);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues.map((i) => i.message).join("; "),
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, message: "AUTH_REQUIRED" };
  }

  const { data, error } = await supabase
    .from("note_folders")
    .insert({ user_id: user.id, name: parsed.data })
    .select("id")
    .maybeSingle();

  if (error || !data?.id) {
    return { ok: false, message: error?.message ?? "INSERT_FAILED" };
  }

  revalidateProfileTree();
  return { ok: true, id: data.id };
}

const renameSchema = z.object({
  folderId: z.string().uuid(),
  name: folderNameSchema,
});

export async function renameNoteFolder(
  input: z.infer<typeof renameSchema>,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const parsed = renameSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues.map((i) => i.message).join("; "),
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "AUTH_REQUIRED" };

  const { error } = await supabase
    .from("note_folders")
    .update({ name: parsed.data.name })
    .eq("id", parsed.data.folderId)
    .eq("user_id", user.id);

  if (error) return { ok: false, message: error.message };

  revalidateProfileTree();
  return { ok: true };
}

const deleteFolderSchema = z.object({ folderId: z.string().uuid() });

export async function deleteNoteFolder(
  input: z.infer<typeof deleteFolderSchema>,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const parsed = deleteFolderSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Invalid folder." };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "AUTH_REQUIRED" };

  const { error } = await supabase
    .from("note_folders")
    .delete()
    .eq("id", parsed.data.folderId)
    .eq("user_id", user.id);

  if (error) return { ok: false, message: error.message };

  revalidateProfileTree();
  return { ok: true };
}
