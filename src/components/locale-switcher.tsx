"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const target = locale === "vi" ? "en" : "vi";

  return (
    <button
      type="button"
      className="rounded-md border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-xs font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]"
      onClick={() => {
        router.replace(pathname, { locale: target });
      }}
      aria-label={t("label")}
    >
      {target === "en" ? t("en") : t("vi")}
    </button>
  );
}
