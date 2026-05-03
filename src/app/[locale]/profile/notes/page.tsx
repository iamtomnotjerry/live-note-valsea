import { getTranslations } from "next-intl/server";
import { ProfileNotesLibrary } from "@/features/profile/profile-notes-library";
import { ProfileNotesPagination } from "@/features/profile/profile-notes-pagination";
import { listTranscriptSessionsForLibrary } from "@/features/profile/transcript-session-actions";
import { cn } from "@/lib/utils";

export async function generateMetadata() {
  const t = await getTranslations("Profile");
  return {
    title: t("libraryTitle"),
    description: t("libraryMetaDescription"),
  };
}

type PageProps = { searchParams: Promise<{ page?: string }> };

export default async function ProfileAllNotesPage({ searchParams }: PageProps) {
  const t = await getTranslations("Profile");
  const sp = await searchParams;
  const pageNum = Math.max(1, Math.floor(Number(sp.page)) || 1);
  const { items: sessions, hasMore } = await listTranscriptSessionsForLibrary({
    page: pageNum,
  });

  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-8",
        "border-2 border-[var(--neo-ink)] shadow-[6px_6px_0_0_var(--neo-raised)]",
      )}
    >
      <header className="mb-8 border-b border-[var(--border)] pb-6">
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted-fg)]">
          {t("notesParentHint")}
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
          {t("libraryHeading")}
        </h1>
        <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-[var(--muted-fg)]">
          {t("libraryLead")}
        </p>
      </header>
      <ProfileNotesLibrary sessions={sessions} tone="landing" mode="grouped" />
      <ProfileNotesPagination
        hasMore={hasMore}
        nextHref={`/profile/notes?page=${pageNum + 1}`}
        tone="landing"
      />
    </div>
  );
}
