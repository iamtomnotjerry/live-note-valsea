import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { NavLink } from "@/components/navigation/nav-link";
import { ProfileNotesLibrary } from "@/features/profile/profile-notes-library";
import { ProfileNotesPagination } from "@/features/profile/profile-notes-pagination";
import {
  getNoteFolderMeta,
  listTranscriptSessionsInFolder,
} from "@/features/profile/transcript-session-actions";
import { cn } from "@/lib/utils";

const UNCATEGORIZED = "uncategorized";

type Props = {
  params: Promise<{ folderId: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { folderId } = await params;
  const t = await getTranslations("Profile");
  if (folderId === UNCATEGORIZED) {
    return { title: t("foldersUncategorizedTitle") };
  }
  const folder = await getNoteFolderMeta(folderId);
  if (!folder) return { title: t("folderNotFoundTitle") };
  return { title: folder.name };
}

export default async function ProfileFolderNotesPage({
  params,
  searchParams,
}: Props) {
  const { folderId } = await params;
  const sp = await searchParams;
  const pageNum = Math.max(1, Math.floor(Number(sp.page)) || 1);
  const t = await getTranslations("Profile");

  let heading: string;
  if (folderId === UNCATEGORIZED) {
    heading = t("foldersUncategorizedTitle");
  } else {
    const folder = await getNoteFolderMeta(folderId);
    if (!folder) notFound();
    heading = folder.name;
  }

  const { items: sessions, hasMore } = await listTranscriptSessionsInFolder(
    folderId,
    { page: pageNum },
  );

  const folderBase =
    folderId === UNCATEGORIZED
      ? "/profile/folders/uncategorized"
      : `/profile/folders/${folderId}`;

  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-8",
        "border-2 border-[var(--neo-ink)] shadow-[6px_6px_0_0_var(--neo-raised)]",
      )}
    >
      <header className="mb-8 flex flex-col gap-3 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted-fg)]">
            <NavLink
              href="/profile/folders"
              className="text-[var(--muted-fg)] underline-offset-2 hover:text-[var(--foreground)] hover:underline"
            >
              {t("editorBreadcrumbFolders")}
            </NavLink>
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
            {heading}
          </h1>
          <p className="mt-2 text-sm font-medium text-[var(--muted-fg)]">
            {t("folderNotesLead")}
          </p>
        </div>
        <NavLink
          href="/profile/notes"
          className={cn(
            "shrink-0 text-sm font-extrabold text-[var(--muted-fg)] underline-offset-2 hover:text-[var(--foreground)] hover:underline",
          )}
        >
          {t("folderViewAllNotes")}
        </NavLink>
      </header>

      <ProfileNotesLibrary
        sessions={sessions}
        tone="landing"
        mode="flat"
        emptyTitleKey="folderEmptyTitle"
        emptyBodyKey="folderEmptyBody"
      />
      <ProfileNotesPagination
        hasMore={hasMore}
        nextHref={`${folderBase}?page=${pageNum + 1}`}
        tone="landing"
      />
    </div>
  );
}
