import { getTranslations } from "next-intl/server";
import { NavLink } from "@/components/navigation/nav-link";
import { FolderManageTile } from "@/features/profile/folder-manage-tile";
import { FoldersCreateForm } from "@/features/profile/folders-create-form";
import { listFolderSummariesWithCounts } from "@/features/profile/transcript-session-actions";
import { cn } from "@/lib/utils";

export async function generateMetadata() {
  const t = await getTranslations("Profile");
  return {
    title: t("foldersPageTitle"),
    description: t("foldersMetaDescription"),
  };
}

export default async function ProfileFoldersPage() {
  const t = await getTranslations("Profile");
  const { folders, uncategorizedCount } = await listFolderSummariesWithCounts();

  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-8",
        "border-2 border-[var(--neo-ink)] shadow-[6px_6px_0_0_var(--neo-raised)]",
      )}
    >
      <header className="mb-8 border-b border-[var(--border)] pb-6">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          {t("foldersHeading")}
        </h1>
        <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-[var(--muted-fg)]">
          {t("foldersLead")}
        </p>
      </header>

      <section className="mb-10 space-y-4">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-[var(--muted-fg)]">
          {t("foldersCreateSection")}
        </h2>
        <FoldersCreateForm tone="landing" />
      </section>

      <section className="space-y-4">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-[var(--muted-fg)]">
          {t("foldersBrowseSection")}
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <li>
            <NavLink
              href="/profile/folders/uncategorized"
              className={cn(
                "flex h-full min-h-[7.5rem] flex-col justify-between rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 text-left shadow-sm transition-all hover:border-[var(--foreground)]/25 hover:shadow-md",
                "border-2 border-[var(--neo-ink)] shadow-[4px_4px_0_0_var(--neo-raised)]",
              )}
            >
              <span className="text-base font-extrabold text-[var(--foreground)]">
                {t("foldersUncategorizedTitle")}
              </span>
              <span className="mt-3 text-sm font-bold text-[var(--muted-fg)]">
                {t("foldersNoteCount", { count: uncategorizedCount })}
              </span>
            </NavLink>
          </li>
          {folders.map((f) => (
            <li key={f.id}>
              <FolderManageTile
                folderId={f.id}
                name={f.name}
                noteCount={f.noteCount}
                tone="landing"
              />
            </li>
          ))}
        </ul>
        {folders.length === 0 && uncategorizedCount === 0 ? (
          <p className="text-sm font-medium text-[var(--muted-fg)]">
            {t("foldersNoFoldersYet")}
          </p>
        ) : null}
      </section>
    </div>
  );
}
