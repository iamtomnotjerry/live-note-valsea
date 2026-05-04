"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { useTranslations } from "next-intl";
import {
  createNoteFolder,
  listNoteFolders,
} from "@/features/live-note/note-folder-actions";
import { saveTranscriptSession } from "@/features/live-note/save-transcript-session";
import { Button } from "@/components/ui/button";
import { useDialogFocusTrap } from "@/hooks/use-dialog-focus-trap";
import { cn } from "@/lib/utils";

function defaultNoteTitle(transcript: string): string {
  const line = transcript.trim().split(/\n/)[0] ?? "";
  const words = line.split(/\s+/).filter(Boolean).slice(0, 10).join(" ");
  return (words || "Live note").slice(0, 200);
}

export type SaveTranscriptDialogProps = {
  open: boolean;
  onClose: () => void;
  transcript: string;
  tone?: "default" | "landing";
  onSaved: (id: string) => void;
  onAuthRequired?: () => void;
};

export function SaveTranscriptDialog({
  open,
  onClose,
  transcript,
  tone = "landing",
  onSaved,
  onAuthRequired,
}: SaveTranscriptDialogProps) {
  const neo = tone === "landing";
  const t = useTranslations("Rtt");
  const [folders, setFolders] = useState<{ id: string; name: string }[]>([]);
  const [folderId, setFolderId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [, startTransition] = useTransition();
  const dialogPanelRef = useRef<HTMLDivElement>(null);
  useDialogFocusTrap(open, dialogPanelRef);

  const derivedTitle = useMemo(
    () => defaultNoteTitle(transcript),
    [transcript],
  );

  const refreshFolders = useCallback(() => {
    startTransition(() => {
      void listNoteFolders().then((result) => {
        if (result.ok) setFolders(result.folders);
        else setFolders([]);
      });
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    startTransition(() => {
      setTitle(derivedTitle);
      setFolderId("");
      setNewFolderName("");
      setFormError(null);
    });
    refreshFolders();
  }, [open, derivedTitle, refreshFolders]);

  useEffect(() => {
    if (!open) return;
    function onKey(ev: KeyboardEvent) {
      if (ev.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleCreateFolder = useCallback(async () => {
    const name = newFolderName.trim();
    if (!name) return;
    setCreatingFolder(true);
    setFormError(null);
    try {
      const result = await createNoteFolder(name);
      if (!result.ok) {
        if (result.message === "AUTH_REQUIRED") {
          onAuthRequired?.();
          setFormError(t("saveDialogAuthRequired"));
        } else {
          setFormError(result.message);
        }
        return;
      }
      setNewFolderName("");
      setFolderId(result.id);
      refreshFolders();
    } finally {
      setCreatingFolder(false);
    }
  }, [newFolderName, onAuthRequired, refreshFolders, t]);

  const handleSave = useCallback(async () => {
    const trimmedTitle = title.trim();
    if (!transcript.trim()) {
      setFormError(t("saveDialogEmptyTranscript"));
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      const result = await saveTranscriptSession({
        transcript,
        title: trimmedTitle || undefined,
        folderId: folderId || undefined,
      });
      if (!result.ok) {
        if (result.code === "AUTH_REQUIRED") {
          onAuthRequired?.();
          setFormError(t("saveSessionExpired"));
        } else {
          setFormError(result.message ?? t("saveFailed"));
        }
        return;
      }
      onSaved(result.id);
      onClose();
    } finally {
      setSaving(false);
    }
  }, [folderId, onAuthRequired, onClose, onSaved, t, title, transcript]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/45 p-4 sm:items-center"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogPanelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="save-note-dialog-title"
        className={cn(
          "max-h-[min(90dvh,36rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xl sm:p-6",
          neo &&
            "border-2 border-[var(--neo-ink)] shadow-[8px_8px_0_0_var(--neo-raised)]",
        )}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2
          id="save-note-dialog-title"
          className="text-lg font-extrabold tracking-tight text-[var(--foreground)] sm:text-xl"
        >
          {t("saveDialogTitle")}
        </h2>
        <p className="mt-1 text-sm font-medium text-[var(--muted-fg)]">
          {t("saveDialogSubtitle")}
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="save-note-title"
              className="text-xs font-bold uppercase tracking-wide text-[var(--muted-fg)]"
            >
              {t("saveDialogNoteTitle")}
            </label>
            <input
              id="save-note-title"
              type="text"
              maxLength={200}
              value={title}
              autoFocus
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("saveDialogNoteTitlePlaceholder")}
              className={cn(
                "mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm font-semibold text-[var(--foreground)] outline-none ring-[var(--ring)] transition-shadow focus-visible:ring-2",
                neo &&
                  "border-2 border-[var(--neo-ink)] shadow-[3px_3px_0_0_var(--neo-raised)]",
              )}
            />
          </div>

          <div>
            <label
              htmlFor="save-note-folder"
              className="text-xs font-bold uppercase tracking-wide text-[var(--muted-fg)]"
            >
              {t("saveDialogFolder")}
            </label>
            <p className="mt-0.5 text-xs text-[var(--muted-fg)]">
              {t("saveDialogFolderHint")}
            </p>
            <select
              id="save-note-folder"
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
              className={cn(
                "mt-1.5 w-full cursor-pointer rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm font-bold text-[var(--foreground)] outline-none ring-[var(--ring)] transition-shadow focus-visible:ring-2",
                neo &&
                  "border-2 border-[var(--neo-ink)] shadow-[3px_3px_0_0_var(--neo-raised)]",
              )}
            >
              <option value="">{t("saveDialogFolderNone")}</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div
            className={cn(
              "rounded-xl border border-dashed border-[var(--border)] p-3",
              neo && "border-[var(--neo-ink)]",
            )}
          >
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted-fg)]">
              {t("saveDialogNewFolderSection")}
            </p>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                type="text"
                maxLength={120}
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder={t("saveDialogNewFolderPlaceholder")}
                className={cn(
                  "min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-medium text-[var(--foreground)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                  neo && "border-2 border-[var(--neo-ink)]",
                )}
              />
              <Button
                type="button"
                variant="secondary"
                className={cn(
                  "shrink-0",
                  neo && "neo-btn neo-btn--ghost font-extrabold",
                )}
                loading={creatingFolder}
                disabled={!newFolderName.trim()}
                onClick={() => void handleCreateFolder()}
              >
                {creatingFolder
                  ? t("saveDialogCreatingFolder")
                  : t("saveDialogCreateFolder")}
              </Button>
            </div>
          </div>
        </div>

        {formError ? (
          <p
            className="mt-4 text-sm font-medium text-red-600 dark:text-red-400"
            role="alert"
          >
            {formError}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            className={cn(neo && "neo-btn neo-btn--ghost font-extrabold")}
            disabled={saving}
            onClick={onClose}
          >
            {t("saveDialogCancel")}
          </Button>
          <Button
            type="button"
            variant={neo ? "secondary" : "primary"}
            className={cn(neo && "neo-btn neo-btn--sky font-extrabold")}
            loading={saving}
            onClick={() => void handleSave()}
          >
            {saving ? t("saveSaving") : t("saveDialogConfirm")}
          </Button>
        </div>
      </div>
    </div>
  );
}
