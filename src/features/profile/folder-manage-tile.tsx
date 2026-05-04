"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { NavLink } from "@/components/navigation/nav-link";
import {
  deleteNoteFolder,
  renameNoteFolder,
} from "@/features/live-note/note-folder-actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FolderManageTileProps = {
  folderId: string;
  name: string;
  noteCount: number;
  tone?: "default" | "landing";
};

export function FolderManageTile({
  folderId,
  name: initialName,
  noteCount,
  tone = "landing",
}: FolderManageTileProps) {
  const neo = tone === "landing";
  const t = useTranslations("Profile");
  const router = useRouter();
  const [renaming, setRenaming] = useState(false);
  const [draft, setDraft] = useState(initialName);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancelRename = useCallback(() => {
    setRenaming(false);
    setDraft(initialName);
    setError(null);
  }, [initialName]);

  const submitRename = useCallback(async () => {
    const next = draft.trim();
    if (!next || next === initialName) {
      cancelRename();
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const r = await renameNoteFolder({ folderId, name: next });
      if (!r.ok) {
        setError(
          r.message === "AUTH_REQUIRED" ? t("editorSessionExpired") : r.message,
        );
        return;
      }
      setRenaming(false);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }, [cancelRename, draft, folderId, initialName, router, t]);

  const onDelete = useCallback(async () => {
    if (!window.confirm(t("folderDeleteConfirm"))) return;
    setBusy(true);
    setError(null);
    try {
      const r = await deleteNoteFolder({ folderId });
      if (!r.ok) {
        setError(
          r.message === "AUTH_REQUIRED" ? t("editorSessionExpired") : r.message,
        );
        return;
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  }, [folderId, router, t]);

  return (
    <div
      className={cn(
        "flex h-full min-h-[7.5rem] flex-col rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-sm transition-all hover:border-[var(--foreground)]/25 hover:shadow-md",
        "border-2 border-[var(--neo-ink)] shadow-[4px_4px_0_0_var(--neo-raised)]",
      )}
    >
      <div className="flex flex-1 flex-col p-4">
        {renaming ? (
          <div className="flex min-h-0 flex-1 flex-col gap-2">
            <label className="sr-only" htmlFor={`rename-folder-${folderId}`}>
              {t("folderRenameLabel")}
            </label>
            <input
              id={`rename-folder-${folderId}`}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={120}
              disabled={busy}
              className={cn(
                "w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5 text-sm font-bold text-[var(--foreground)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                neo && "border-2 border-[var(--neo-ink)]",
              )}
            />
            <div className="mt-auto flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                className={cn(neo && "neo-btn neo-btn--sky font-extrabold")}
                loading={busy}
                disabled={!draft.trim()}
                onClick={() => void submitRename()}
              >
                {busy ? t("folderRenameSaving") : t("folderRenameSave")}
              </Button>
              <Button
                type="button"
                variant="ghost"
                disabled={busy}
                onClick={cancelRename}
                className={cn(neo && "neo-btn neo-btn--ghost font-extrabold")}
              >
                {t("folderRenameCancel")}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <NavLink
              href={`/profile/folders/${folderId}`}
              className="block min-w-0 flex-1 text-left outline-none ring-[var(--ring)] focus-visible:rounded-md focus-visible:ring-2"
            >
              <span className="line-clamp-2 text-base font-extrabold text-[var(--foreground)]">
                {initialName}
              </span>
              <span className="mt-3 block text-sm font-bold text-[var(--muted-fg)]">
                {t("foldersNoteCount", { count: noteCount })}
              </span>
            </NavLink>
            <div className="mt-3 flex flex-wrap gap-2 border-t border-[var(--border)] pt-3">
              <Button
                type="button"
                variant="ghost"
                className={cn(
                  "text-xs font-extrabold",
                  neo && "neo-btn neo-btn--ghost",
                )}
                disabled={busy}
                onClick={() => {
                  setRenaming(true);
                  setDraft(initialName);
                  setError(null);
                }}
              >
                {t("folderRename")}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className={cn(
                  "text-xs font-extrabold text-red-700 dark:text-red-400",
                  neo && "neo-btn neo-btn--ghost",
                )}
                loading={busy}
                onClick={() => void onDelete()}
              >
                {t("folderDelete")}
              </Button>
            </div>
          </>
        )}
      </div>
      {error ? (
        <p
          className="border-t border-[var(--border)] px-4 py-2 text-xs font-bold text-red-600 dark:text-red-400"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
