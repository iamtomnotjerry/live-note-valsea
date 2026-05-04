"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { listNoteFolders } from "@/features/live-note/note-folder-actions";
import type { TranscriptSessionEditor } from "@/features/profile/transcript-session-actions";
import { NoteValseaToolbar } from "@/features/profile/note-valsea-toolbar";
import {
  deleteTranscriptSession,
  updateTranscriptSession,
} from "@/features/profile/transcript-session-actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FolderOption = { id: string; name: string };

type NoteEditorFormProps = {
  session: TranscriptSessionEditor;
  initialFolders: FolderOption[];
  tone?: "default" | "landing";
};

export function NoteEditorForm({
  session,
  initialFolders,
  tone = "landing",
}: NoteEditorFormProps) {
  const neo = tone === "landing";
  const t = useTranslations("Profile");
  const router = useRouter();
  const [, startRefresh] = useTransition();

  const [title, setTitle] = useState(session.title?.trim() || "");
  const [transcript, setTranscript] = useState(session.transcript);
  const [folderId, setFolderId] = useState(session.folder_id ?? "");
  const [folders, setFolders] = useState(initialFolders);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const dirty = useMemo(() => {
    const t0 = (session.title ?? "").trim();
    const titleDirty = title.trim() !== t0;
    const bodyDirty = transcript !== session.transcript;
    const folderDirty = (session.folder_id ?? "") !== folderId;
    return titleDirty || bodyDirty || folderDirty;
  }, [
    folderId,
    session.folder_id,
    session.title,
    session.transcript,
    title,
    transcript,
  ]);

  const reloadFolders = useCallback(() => {
    startRefresh(() => {
      void listNoteFolders().then((result) => {
        if (result.ok) setFolders(result.folders);
      });
    });
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const result = await updateTranscriptSession({
        sessionId: session.id,
        title: title.trim() || undefined,
        transcript,
        folderId,
      });
      if (!result.ok) {
        setError(
          result.message === "AUTH_REQUIRED"
            ? t("editorSessionExpired")
            : result.message,
        );
        return;
      }
      setMessage(t("editorSaved"));
      router.refresh();
    } finally {
      setSaving(false);
    }
  }, [folderId, router, session.id, t, title, transcript]);

  const handleDelete = useCallback(async () => {
    if (!window.confirm(t("editorDeleteConfirm"))) return;
    setDeleting(true);
    setError(null);
    try {
      const result = await deleteTranscriptSession(session.id);
      if (!result.ok) {
        setError(
          result.message === "AUTH_REQUIRED"
            ? t("editorSessionExpired")
            : result.message,
        );
        return;
      }
      router.push("/profile/folders");
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }, [router, session.id, t]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Link
          href="/profile/folders"
          className="font-bold text-[var(--muted-fg)] underline-offset-2 hover:text-[var(--foreground)] hover:underline"
        >
          {t("editorBreadcrumbFolders")}
        </Link>
        <span className="text-[var(--muted-fg)]" aria-hidden>
          /
        </span>
        <Link
          href="/profile/notes"
          className="font-bold text-[var(--muted-fg)] underline-offset-2 hover:text-[var(--foreground)] hover:underline"
        >
          {t("editorBreadcrumbAllNotes")}
        </Link>
        <span className="text-[var(--muted-fg)]" aria-hidden>
          /
        </span>
        <span className="font-extrabold text-[var(--foreground)]">
          {t("editorBreadcrumbNote")}
        </span>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <label className="sr-only" htmlFor="note-title">
            {t("editorTitleLabel")}
          </label>
          <input
            id="note-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            placeholder={t("editorTitlePlaceholder")}
            className={cn(
              "w-full border-0 border-b-2 border-[var(--border)] bg-transparent pb-2 text-2xl font-extrabold tracking-tight text-[var(--foreground)] outline-none placeholder:text-[var(--muted-fg)] focus-visible:border-[var(--ring)] sm:text-3xl",
              neo && "border-[var(--neo-ink)]",
            )}
          />
          <p className="text-xs font-medium text-[var(--muted-fg)]">
            {t("editorHint")}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
          <Button
            type="button"
            variant="ghost"
            className={cn(neo && "neo-btn neo-btn--ghost font-extrabold")}
            disabled={saving || !dirty}
            onClick={() => void handleSave()}
          >
            {saving ? t("editorSaving") : t("editorSave")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className={cn(
              neo &&
                "neo-btn neo-btn--ghost font-extrabold text-red-700 dark:text-red-400",
            )}
            disabled={deleting}
            onClick={() => void handleDelete()}
          >
            {deleting ? t("editorDeleting") : t("editorDelete")}
          </Button>
        </div>
      </div>

      <div>
        <label
          htmlFor="note-folder"
          className="text-xs font-bold uppercase tracking-wide text-[var(--muted-fg)]"
        >
          {t("editorFolderLabel")}
        </label>
        <select
          id="note-folder"
          value={folderId}
          onChange={(e) => setFolderId(e.target.value)}
          className={cn(
            "mt-1.5 w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm font-bold text-[var(--foreground)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:w-auto",
            neo &&
              "border-2 border-[var(--neo-ink)] shadow-[3px_3px_0_0_var(--neo-raised)]",
          )}
        >
          <option value="">{t("editorFolderNone")}</option>
          {folders.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="ml-0 mt-2 text-xs font-bold text-[var(--muted-fg)] underline-offset-2 hover:text-[var(--foreground)] hover:underline sm:ml-3 sm:mt-0"
          onClick={() => reloadFolders()}
        >
          {t("editorRefreshFolders")}
        </button>
      </div>

      <NoteValseaToolbar
        transcript={transcript}
        setTranscript={setTranscript}
        setMessage={setMessage}
        setError={setError}
        neo={neo}
      />

      <label className="sr-only" htmlFor="note-body">
        {t("editorBodyLabel")}
      </label>
      <textarea
        id="note-body"
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        spellCheck
        className={cn(
          "min-h-[min(70dvh,36rem)] w-full resize-y rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 text-base leading-relaxed text-[var(--foreground)] shadow-inner outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:p-6 sm:text-[17px]",
          neo &&
            "border-2 border-[var(--neo-ink)] shadow-[6px_6px_0_0_var(--neo-raised)]",
        )}
      />

      {message ? (
        <p
          className="text-sm font-bold text-emerald-700 dark:text-emerald-400"
          role="status"
        >
          {message}
        </p>
      ) : null}
      {error ? (
        <p
          className="text-sm font-bold text-red-600 dark:text-red-400"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
