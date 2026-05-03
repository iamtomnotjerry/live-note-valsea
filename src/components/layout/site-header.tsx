import { getTranslations } from "next-intl/server";
import { HeaderAuth } from "@/components/layout/header-auth";
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
        "sticky top-0 z-50 transition-colors duration-200",
        tone === "landing"
          ? "border-b-0 bg-transparent"
          : "border-b border-[var(--border)] bg-[var(--background)]/85 backdrop-blur-md",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto grid max-w-6xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-2 gap-y-2 px-4 sm:gap-x-4 sm:px-6",
          tone === "landing"
            ? "neo-header-shell mt-3 min-h-[3.75rem] py-2.5 sm:mt-4 sm:min-h-[4.25rem] sm:py-3"
            : "min-h-[3.75rem] py-2.5 sm:min-h-[4.25rem] sm:py-3",
        )}
      >
        <Link
          href="/"
          className="min-w-0 shrink-0 truncate text-left text-sm font-extrabold tracking-tight text-[var(--foreground)] sm:text-base"
          title={tMeta("title")}
        >
          {t("brandTitle")}
        </Link>
        <nav
          aria-label={t("navLabel")}
          className="flex min-w-0 flex-wrap items-center justify-center justify-self-center gap-x-2 gap-y-1 text-xs font-bold sm:gap-x-4 sm:text-sm"
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
        </nav>
        <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-2.5">
          <ThemeToggle />
          <LocaleSwitcher />
          <HeaderAuth headerTone={tone} />
        </div>
      </div>
    </header>
  );
}
