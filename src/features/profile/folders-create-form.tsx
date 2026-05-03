"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { createNoteFolder } from "@/features/live-note/note-folder-actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FoldersCreateFormProps = {
  tone?: "default" | "landing";
};

export function FoldersCreateForm({
  tone = "landing",
}: FoldersCreateFormProps) {
  const neo = tone === "landing";
  const t = useTranslations("Profile");
  const router = useRouter();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const n = name.trim();
    if (!n) return;
    setBusy(true);
    setError(null);
    try {
      const r = await createNoteFolder(n);
      if (!r.ok) {
        setError(
          r.message === "AUTH_REQUIRED" ? t("editorSessionExpired") : r.message,
        );
        return;
      }
      setName("");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <form
        onSubmit={(e) => void onSubmit(e)}
        className={cn(
          "flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-4 sm:flex-row sm:items-end",
          neo &&
            "border-2 border-[var(--neo-ink)] shadow-[4px_4px_0_0_var(--neo-raised)]",
        )}
      >
        <div className="min-w-0 flex-1">
          <label
            htmlFor="new-folder-name"
            className="text-xs font-bold uppercase text-[var(--muted-fg)]"
          >
            {t("foldersCreateLabel")}
          </label>
          <input
            id="new-folder-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={120}
            placeholder={t("foldersCreatePlaceholder")}
            className={cn(
              "mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
              neo && "border-2 border-[var(--neo-ink)]",
            )}
          />
        </div>
        <Button
          type="submit"
          variant={neo ? "secondary" : "primary"}
          className={cn(neo && "neo-btn neo-btn--sky shrink-0 font-extrabold")}
          disabled={busy || !name.trim()}
        >
          {busy ? t("foldersCreating") : t("foldersCreateSubmit")}
        </Button>
      </form>
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
