import { getTranslations } from "next-intl/server";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";

type SiteHeaderProps = {
  className?: string;
};

export async function SiteHeader({ className }: SiteHeaderProps) {
  const t = await getTranslations("Header");
  const tMeta = await getTranslations("Meta");

  return (
    <header
      className={cn(
        "border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md",
        className,
      )}
    >
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="max-w-[min(100%,14rem)] truncate text-sm font-semibold tracking-tight text-[var(--foreground)] sm:max-w-none"
          title={tMeta("title")}
        >
          {t("brandTitle")}
        </Link>
        <nav
          aria-label={t("navLabel")}
          className="flex shrink-0 items-center gap-3 text-sm sm:gap-4"
        >
          <Link
            href="/live"
            className="text-[var(--muted-fg)] transition-colors hover:text-[var(--foreground)]"
          >
            {t("live")}
          </Link>
          <a
            href="https://valsea.ai/docs"
            className="text-[var(--muted-fg)] transition-colors hover:text-[var(--foreground)]"
            rel="noopener noreferrer"
            target="_blank"
          >
            {t("valseaApi")}
          </a>
          <LocaleSwitcher />
        </nav>
      </div>
    </header>
  );
}
