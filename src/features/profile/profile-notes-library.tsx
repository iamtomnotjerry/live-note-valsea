import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { TranscriptSessionListItem } from "@/features/profile/transcript-session-actions";
import { cn } from "@/lib/utils";

function formatUpdated(iso: string, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function groupByFolder(sessions: TranscriptSessionListItem[]) {
  const uncategorized: TranscriptSessionListItem[] = [];
  const byFolder = new Map<
    string,
    { name: string; items: TranscriptSessionListItem[] }
  >();

  for (const s of sessions) {
    if (!s.folder_id || !s.folder_name) {
      uncategorized.push(s);
      continue;
    }
    const g = byFolder.get(s.folder_id);
    if (g) {
      g.items.push(s);
    } else {
      byFolder.set(s.folder_id, { name: s.folder_name, items: [s] });
    }
  }

  return { uncategorized, folders: [...byFolder.entries()] };
}

type LibraryNoteCardProps = {
  s: TranscriptSessionListItem;
  neo: boolean;
  untitled: string;
  formatNoteUpdated: (iso: string) => string;
};

function LibraryNoteCard({
  s,
  neo,
  untitled,
  formatNoteUpdated,
}: LibraryNoteCardProps) {
  const title = (s.title?.trim() || untitled).slice(0, 120);
  return (
    <Link
      href={`/profile/notes/${s.id}`}
      className={cn(
        "block rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-left shadow-sm transition-all hover:border-[var(--foreground)]/25 hover:shadow-md",
        neo &&
          "border-2 border-[var(--neo-ink)] shadow-[4px_4px_0_0_var(--neo-raised)] hover:translate-y-[-1px]",
      )}
    >
      <p className="line-clamp-2 text-base font-extrabold leading-snug text-[var(--foreground)]">
        {title}
      </p>
      <p className="mt-2 text-xs font-medium text-[var(--muted-fg)]">
        {formatNoteUpdated(s.updated_at)}
      </p>
    </Link>
  );
}

type LibrarySectionProps = {
  heading: string;
  items: TranscriptSessionListItem[];
  neo: boolean;
  untitled: string;
  formatNoteUpdated: (iso: string) => string;
};

function LibrarySection({
  heading,
  items,
  neo,
  untitled,
  formatNoteUpdated,
}: LibrarySectionProps) {
  if (items.length === 0) return null;
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-extrabold uppercase tracking-wider text-[var(--muted-fg)]">
        {heading}
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((s) => (
          <li key={s.id}>
            <LibraryNoteCard
              s={s}
              neo={neo}
              untitled={untitled}
              formatNoteUpdated={formatNoteUpdated}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

type ProfileNotesLibraryProps = {
  sessions: TranscriptSessionListItem[];
  tone?: "default" | "landing";
  /** `grouped`: sections by folder. `flat`: single grid (e.g. inside one folder). */
  mode?: "grouped" | "flat";
  emptyTitleKey?: "libraryEmptyTitle" | "folderEmptyTitle";
  emptyBodyKey?: "libraryEmptyBody" | "folderEmptyBody";
};

export async function ProfileNotesLibrary({
  sessions,
  tone = "landing",
  mode = "grouped",
  emptyTitleKey = "libraryEmptyTitle",
  emptyBodyKey = "libraryEmptyBody",
}: ProfileNotesLibraryProps) {
  const t = await getTranslations("Profile");
  const locale = await getLocale();
  const neo = tone === "landing";
  const { uncategorized, folders } = groupByFolder(sessions);
  const untitled = t("noteUntitled");
  const formatNoteUpdated = (iso: string) =>
    t("noteCardUpdated", { date: formatUpdated(iso, locale) });

  if (sessions.length === 0) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)]/60 px-6 py-14 text-center",
          neo && "border-2 border-[var(--neo-ink)]",
        )}
      >
        <p className="text-lg font-extrabold text-[var(--foreground)]">
          {emptyTitleKey === "folderEmptyTitle"
            ? t("folderEmptyTitle")
            : t("libraryEmptyTitle")}
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm font-medium text-[var(--muted-fg)]">
          {emptyBodyKey === "folderEmptyBody"
            ? t("folderEmptyBody")
            : t("libraryEmptyBody")}
        </p>
        <Link
          href="/live"
          className={cn(
            "mt-6 inline-flex rounded-full border border-[var(--border)] bg-[var(--background)] px-5 py-2.5 text-sm font-extrabold text-[var(--foreground)] no-underline transition-colors hover:bg-[var(--muted)]",
            neo && "neo-btn neo-btn--mint border-0",
          )}
        >
          {t("libraryEmptyCta")}
        </Link>
      </div>
    );
  }

  if (mode === "flat") {
    return (
      <ul className="grid gap-3 sm:grid-cols-2">
        {sessions.map((s) => (
          <li key={s.id}>
            <LibraryNoteCard
              s={s}
              neo={neo}
              untitled={untitled}
              formatNoteUpdated={formatNoteUpdated}
            />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="space-y-10">
      <LibrarySection
        heading={t("sectionUncategorized")}
        items={uncategorized}
        neo={neo}
        untitled={untitled}
        formatNoteUpdated={formatNoteUpdated}
      />
      {folders.map(([folderId, { name, items }]) => (
        <LibrarySection
          key={folderId}
          heading={name}
          items={items}
          neo={neo}
          untitled={untitled}
          formatNoteUpdated={formatNoteUpdated}
        />
      ))}
    </div>
  );
}
