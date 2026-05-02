import { getTranslations } from "next-intl/server";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";

type SiteHeaderProps = {
  className?: string;
  tone?: "default" | "landing";
};

export async function SiteHeader({
  className,
  tone = "default",
}: SiteHeaderProps) {
  const t = await getTranslations("Header");
  const tMeta = await getTranslations("Meta");

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-200",
        tone === "landing"
          ? "border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_78%,transparent)] shadow-sm backdrop-blur-xl"
          : "border-[var(--border)] bg-[var(--background)]/85 backdrop-blur-md",
        className,
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-4 sm:h-16 sm:px-6">
        <Link
          href="/"
          className="truncate text-sm font-extrabold tracking-tight text-[var(--foreground)] sm:text-base"
          title={tMeta("title")}
        >
          {t("brandTitle")}
        </Link>
        <nav
          aria-label={t("navLabel")}
          className="flex max-w-[min(100%,28rem)] flex-wrap items-center justify-end gap-x-2 gap-y-1 text-xs font-bold sm:max-w-none sm:gap-x-4 sm:text-sm"
        >
          <Link
            href="/#features"
            className="hidden cursor-pointer text-[var(--muted-fg)] transition-colors duration-200 hover:text-[var(--foreground)] md:inline"
          >
            {t("navFeatures")}
          </Link>
          <Link
            href="/#why"
            className="hidden cursor-pointer text-[var(--muted-fg)] transition-colors duration-200 hover:text-[var(--foreground)] lg:inline"
          >
            {t("navWhy")}
          </Link>
          <Link
            href="/live"
            className="cursor-pointer text-[var(--muted-fg)] transition-colors duration-200 hover:text-[var(--foreground)]"
          >
            {t("live")}
          </Link>
          <a
            href="https://valsea.ai/docs"
            className="hidden cursor-pointer text-[var(--muted-fg)] transition-colors duration-200 hover:text-[var(--foreground)] sm:inline"
            rel="noopener noreferrer"
            target="_blank"
          >
            {t("valseaApi")}
          </a>
          <ThemeToggle />
          <LocaleSwitcher />
        </nav>
      </div>
    </header>
  );
}
