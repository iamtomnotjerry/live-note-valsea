import { getTranslations } from "next-intl/server";
import { ProfileNotesLoadMoreLink } from "@/features/profile/profile-notes-load-more-link";

type ProfileNotesPaginationProps = {
  hasMore: boolean;
  nextHref: string;
  tone?: "default" | "landing";
};

export async function ProfileNotesPagination({
  hasMore,
  nextHref,
  tone = "landing",
}: ProfileNotesPaginationProps) {
  if (!hasMore) return null;
  const t = await getTranslations("Profile");
  const neo = tone === "landing";
  return (
    <nav
      className="mt-10 flex justify-center border-t border-[var(--border)] pt-8"
      aria-label={t("libraryPaginationNav")}
    >
      <ProfileNotesLoadMoreLink
        href={nextHref}
        label={t("libraryLoadMore")}
        neo={neo}
      />
    </nav>
  );
}
