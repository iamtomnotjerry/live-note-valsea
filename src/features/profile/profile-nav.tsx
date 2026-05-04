"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { NavLink } from "@/components/navigation/nav-link";
import { cn } from "@/lib/utils";

export function ProfileNav() {
  const t = useTranslations("Profile");
  const pathname = usePathname();
  const onFolders =
    pathname === "/profile/folders" || pathname.startsWith("/profile/folders/");
  const onNotes =
    pathname === "/profile/notes" || pathname.startsWith("/profile/notes/");
  const onAccount = pathname === "/profile/account";

  const linkClass = (active: boolean) =>
    cn(
      "block rounded-xl px-3 py-2.5 text-sm font-bold transition-colors",
      active
        ? "bg-[color-mix(in_srgb,var(--landing-sky)_22%,var(--surface))] text-[var(--foreground)] shadow-[inset_0_0_0_2px_var(--neo-ink)]"
        : "text-[var(--muted-fg)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]",
    );

  return (
    <nav aria-label={t("navAria")} className="flex flex-col gap-1 lg:gap-0.5">
      <NavLink href="/profile/folders" className={linkClass(onFolders)}>
        {t("navFolders")}
      </NavLink>
      <NavLink href="/profile/notes" className={linkClass(onNotes)}>
        {t("navNotes")}
      </NavLink>
      <NavLink href="/profile/account" className={linkClass(onAccount)}>
        {t("navAccount")}
      </NavLink>
      <NavLink
        href="/live"
        className={cn(
          "mt-2 block rounded-xl px-3 py-2.5 text-sm font-bold text-[var(--muted-fg)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)] lg:mt-4",
        )}
      >
        {t("navLive")}
      </NavLink>
    </nav>
  );
}
