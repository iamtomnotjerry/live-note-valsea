import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

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
      <Link
        href={nextHref}
        className={cn(
          "rounded-full border border-[var(--border)] bg-[var(--background)] px-5 py-2.5 text-sm font-extrabold text-[var(--foreground)] no-underline transition-colors hover:bg-[var(--muted)]",
          neo && "neo-btn neo-btn--mint border-0",
        )}
      >
        {t("libraryLoadMore")}
      </Link>
    </nav>
  );
}
