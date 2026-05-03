"use server";

import { z } from "zod";
import type { TablesUpdate } from "@/lib/supabase/database.types";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidateProfileTree } from "@/features/profile/revalidate-profile-tree";
import { TRANSCRIPT_LIBRARY_PAGE_SIZE } from "@/features/profile/transcript-library-config";

export type TranscriptSessionListItem = {
  id: string;
  title: string | null;
  created_at: string;
  /** Mirrors DB `updated_at` when column exists; falls back to `created_at` in mappers. */
  updated_at: string;
  folder_id: string | null;
  folder_name: string | null;
};

export type TranscriptSessionListPage = {
  items: TranscriptSessionListItem[];
  page: number;
  pageSize: number;
  hasMore: boolean;
};

type SessionRowDb = {
  id: string;
  title: string | null;
  created_at: string;
  updated_at?: string;
  folder_id: string | null;
  note_folders: { name: string } | { name: string }[] | null;
};

function embedFolderName(rel: SessionRowDb["note_folders"]): string | null {
  if (!rel) return null;
  if (Array.isArray(rel)) return rel[0]?.name ?? null;
  return rel.name;
}

function mapSessionRow(row: SessionRowDb): TranscriptSessionListItem {
  const updated = row.updated_at ?? row.created_at;
  return {
    id: row.id,
    title: row.title,
    created_at: row.created_at,
    updated_at: updated,
    folder_id: row.folder_id,
    folder_name: embedFolderName(row.note_folders),
  };
}

type FolderCountRow = { folder_id: string | null; note_count: number };

async function folderCountsFromRpc(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
): Promise<FolderCountRow[] | null> {
  const { data, error } = await supabase.rpc("note_counts_by_folder_for_user");
  if (error || !data) return null;
  return (
    data as { folder_id: string | null; note_count: number | string }[]
  ).map((r) => ({
    folder_id: r.folder_id,
    note_count: Number(r.note_count),
  }));
}

const UNCATEGORIZED = "uncategorized" as const;

export async function listTranscriptSessionsInFolder(
  folderKey: string,
  opts?: { page?: number; pageSize?: number },
): Promise<TranscriptSessionListPage> {
  const page = Math.max(1, opts?.page ?? 1);
  const pageSize = opts?.pageSize ?? TRANSCRIPT_LIBRARY_PAGE_SIZE;
  const from = (page - 1) * pageSize;
  const to = from + pageSize;

  if (
    folderKey !== UNCATEGORIZED &&
    !z.string().uuid().safeParse(folderKey).success
  ) {
    return { items: [], page, pageSize, hasMore: false };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { items: [], page, pageSize, hasMore: false };

  const base = () =>
    supabase
      .from("transcript_sessions")
      .select(
        "id, title, created_at, updated_at, folder_id, note_folders ( name )",
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(from, to);

  let res;
  if (folderKey === UNCATEGORIZED) {
    res = await base().is("folder_id", null);
  } else {
    const { data: folder } = await supabase
      .from("note_folders")
      .select("id")
      .eq("id", folderKey)
      .eq("user_id", user.id)
      .maybeSingle();
    if (!folder) return { items: [], page, pageSize, hasMore: false };
    res = await base().eq("folder_id", folderKey);
  }

  const { data, error } = res;
  if (error || !data) return { items: [], page, pageSize, hasMore: false };

  const rows = data as SessionRowDb[];
  const hasMore = rows.length > pageSize;
  const items = (hasMore ? rows.slice(0, pageSize) : rows).map(mapSessionRow);
  return { items, page, pageSize, hasMore };
}

export type FolderSummary = {
  id: string;
  name: string;
  noteCount: number;
};

export async function listFolderSummariesWithCounts(): Promise<{
  folders: FolderSummary[];
  uncategorizedCount: number;
}> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { folders: [], uncategorizedCount: 0 };

  const { data: folderRows, error: folderErr } = await supabase
    .from("note_folders")
    .select("id, name")
    .eq("user_id", user.id)
    .order("name");

  if (folderErr || !folderRows) {
    return { folders: [], uncategorizedCount: 0 };
  }

  const rpcCounts = await folderCountsFromRpc(supabase);
  const counts = new Map<string, number>();
  let uncategorized = 0;

  if (rpcCounts) {
    for (const row of rpcCounts) {
      if (row.folder_id == null) uncategorized = row.note_count;
      else counts.set(row.folder_id, row.note_count);
    }
  } else {
    const { data: sessionRows } = await supabase
      .from("transcript_sessions")
      .select("folder_id")
      .eq("user_id", user.id);
    for (const row of sessionRows ?? []) {
      const fid = row.folder_id as string | null;
      if (fid == null) uncategorized += 1;
      else counts.set(fid, (counts.get(fid) ?? 0) + 1);
    }
  }

  const folders: FolderSummary[] = folderRows.map(
    (f: { id: string; name: string }) => ({
      id: f.id,
      name: f.name,
      noteCount: counts.get(f.id) ?? 0,
    }),
  );

  return { folders, uncategorizedCount: uncategorized };
}

export async function getNoteFolderMeta(
  folderId: string,
): Promise<{ id: string; name: string } | null> {
  if (!z.string().uuid().safeParse(folderId).success) return null;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("note_folders")
    .select("id, name")
    .eq("id", folderId)
    .eq("user_id", user.id)
    .maybeSingle();
  return data ?? null;
}

export async function listTranscriptSessionsForLibrary(opts?: {
  page?: number;
  pageSize?: number;
}): Promise<TranscriptSessionListPage> {
  const page = Math.max(1, opts?.page ?? 1);
  const pageSize = opts?.pageSize ?? TRANSCRIPT_LIBRARY_PAGE_SIZE;
  const from = (page - 1) * pageSize;
  const to = from + pageSize;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { items: [], page, pageSize, hasMore: false };

  const { data, error } = await supabase
    .from("transcript_sessions")
    .select(
      "id, title, created_at, updated_at, folder_id, note_folders ( name )",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error || !data) return { items: [], page, pageSize, hasMore: false };

  const rows = data as SessionRowDb[];
  const hasMore = rows.length > pageSize;
  const items = (hasMore ? rows.slice(0, pageSize) : rows).map(mapSessionRow);
  return { items, page, pageSize, hasMore };
}

export type TranscriptSessionEditor = {
  id: string;
  title: string | null;
  transcript: string;
  folder_id: string | null;
  created_at: string;
  updated_at: string;
  folder: { id: string; name: string } | null;
};

type SessionEditorDb = {
  id: string;
  title: string | null;
  transcript: string;
  folder_id: string | null;
  created_at: string;
  updated_at?: string;
  note_folders:
    | { id: string; name: string }
    | { id: string; name: string }[]
    | null;
};

function embedFolderRow(
  rel: SessionEditorDb["note_folders"],
): { id: string; name: string } | null {
  if (!rel) return null;
  if (Array.isArray(rel)) return rel[0] ?? null;
  return rel;
}

export async function getTranscriptSessionForEditor(
  sessionId: string,
): Promise<TranscriptSessionEditor | null> {
  const idParsed = z.string().uuid().safeParse(sessionId);
  if (!idParsed.success) return null;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("transcript_sessions")
    .select(
      "id, title, transcript, folder_id, created_at, updated_at, note_folders ( id, name )",
    )
    .eq("id", idParsed.data)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) return null;

  const row = data as SessionEditorDb;
  return {
    id: row.id,
    title: row.title,
    transcript: row.transcript ?? "",
    folder_id: row.folder_id,
    created_at: row.created_at,
    updated_at: row.updated_at ?? row.created_at,
    folder: embedFolderRow(row.note_folders),
  };
}

const updateSchema = z.object({
  sessionId: z.string().uuid(),
  title: z.string().max(200).optional(),
  transcript: z.string().max(500_000).optional(),
  /** Omit to leave folder unchanged; `""` clears folder. */
  folderId: z.union([z.string().uuid(), z.literal("")]).optional(),
});

export type UpdateTranscriptResult =
  | { ok: true }
  | { ok: false; message: string };

export async function updateTranscriptSession(
  input: z.infer<typeof updateSchema>,
): Promise<UpdateTranscriptResult> {
  const parsed = updateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues.map((i) => i.message).join("; "),
    };
  }

  const { sessionId, title, transcript, folderId } = parsed.data;
  if (
    title === undefined &&
    transcript === undefined &&
    folderId === undefined
  ) {
    return { ok: false, message: "Nothing to update." };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, message: "AUTH_REQUIRED" };
  }

  if (folderId !== undefined && folderId !== "") {
    const { data: folder, error: folderErr } = await supabase
      .from("note_folders")
      .select("id")
      .eq("id", folderId)
      .eq("user_id", user.id)
      .maybeSingle();
    if (folderErr || !folder) {
      return { ok: false, message: "Invalid folder." };
    }
  }

  const patch: TablesUpdate<"transcript_sessions"> = {};
  if (title !== undefined) patch.title = title.trim() || null;
  if (transcript !== undefined) patch.transcript = transcript;
  if (folderId !== undefined) {
    patch.folder_id = folderId === "" ? null : folderId;
  }

  const { error } = await supabase
    .from("transcript_sessions")
    .update(patch)
    .eq("id", sessionId)
    .eq("user_id", user.id);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidateProfileTree();
  return { ok: true };
}

export async function deleteTranscriptSession(
  sessionId: string,
): Promise<UpdateTranscriptResult> {
  const idParsed = z.string().uuid().safeParse(sessionId);
  if (!idParsed.success) {
    return { ok: false, message: "Invalid note id." };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, message: "AUTH_REQUIRED" };
  }

  const { error } = await supabase
    .from("transcript_sessions")
    .delete()
    .eq("id", idParsed.data)
    .eq("user_id", user.id);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidateProfileTree();
  return { ok: true };
}
