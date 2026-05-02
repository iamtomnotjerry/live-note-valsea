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
      className="cursor-pointer rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-bold text-[var(--foreground)] shadow-sm transition-colors duration-200 hover:bg-[var(--muted)]"
      onClick={() => {
        router.replace(pathname, { locale: target });
      }}
      aria-label={t("label")}
    >
      {target === "en" ? t("en") : t("vi")}
    </button>
  );
}
