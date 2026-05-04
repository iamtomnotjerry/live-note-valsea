"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="relative shrink-0">
      <label className="sr-only" htmlFor="locale-switch">
        {t("label")}
      </label>
      <select
        id="locale-switch"
        value={locale}
        aria-label={
          isPending ? `${t("label")} — ${t("switching")}` : t("label")
        }
        aria-busy={isPending || undefined}
        disabled={isPending}
        className={cn(
          "max-w-[10.5rem] cursor-pointer truncate rounded-full border border-[var(--border)] bg-[var(--surface)] py-1.5 pl-2.5 pr-7 text-xs font-bold text-[var(--foreground)] shadow-sm transition-colors duration-200 hover:bg-[var(--muted)] disabled:cursor-wait disabled:opacity-80",
          "appearance-none bg-[length:0.65rem] bg-[right_0.45rem_center] bg-no-repeat",
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b5f7d'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
        }}
        onChange={(e) => {
          const next = e.target.value;
          if (next !== locale) {
            startTransition(() => {
              router.replace(pathname, { locale: next });
            });
          }
        }}
      >
        {routing.locales.map((loc) => (
          <option key={loc} value={loc}>
            {t(loc as AppLocale)}
          </option>
        ))}
      </select>
      {isPending ? (
        <span
          className="pointer-events-none absolute right-7 top-1/2 -translate-y-1/2"
          aria-hidden
        >
          <Spinner
            size="sm"
            decorative
            className="border-t-[var(--foreground)]"
          />
        </span>
      ) : null}
    </div>
  );
}
