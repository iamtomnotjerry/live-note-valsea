import { getTranslations } from "next-intl/server";
import { HeaderAuth } from "@/components/layout/header-auth";
import { SiteHeaderBrandLink } from "@/components/layout/site-header-brand-link";
import { SiteHeaderNav } from "@/components/layout/site-header-nav";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

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
          "mx-auto grid max-w-6xl items-center gap-x-2 gap-y-3 px-4 sm:gap-x-4 sm:px-6",
          // Narrow viewports: row 1 = brand + utilities; row 2 = nav full width (avoids crushing the center column).
          "grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[auto_minmax(0,1fr)_auto] md:gap-y-2",
          tone === "landing"
            ? "neo-header-shell mt-3 min-h-[3.75rem] py-2.5 sm:mt-4 sm:min-h-[4.25rem] sm:py-3"
            : "min-h-[3.75rem] py-2.5 sm:min-h-[4.25rem] sm:py-3",
        )}
      >
        <SiteHeaderBrandLink
          title={tMeta("title")}
          brandTitle={t("brandTitle")}
          className="col-start-1 row-start-1 min-w-0 truncate text-left text-sm font-extrabold tracking-tight text-[var(--foreground)] sm:text-base md:shrink-0"
        />
        <nav
          aria-label={t("navLabel")}
          className="col-span-2 row-start-2 flex min-w-0 flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs font-bold sm:gap-x-4 sm:text-sm md:col-span-1 md:col-start-2 md:row-start-1 md:justify-self-center"
        >
          <SiteHeaderNav
            navFeatures={t("navFeatures")}
            navWhy={t("navWhy")}
            live={t("live")}
            valseaApi={t("valseaApi")}
          />
        </nav>
        <div className="col-start-2 row-start-1 flex shrink-0 items-center justify-end gap-1.5 sm:gap-2.5 md:col-start-3 md:row-start-1">
          <ThemeToggle />
          <LocaleSwitcher />
          <HeaderAuth headerTone={tone} />
        </div>
      </div>
    </header>
  );
}
