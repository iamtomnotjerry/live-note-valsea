"use client";

import { NavLink } from "@/components/navigation/nav-link";
import { cn } from "@/lib/utils";

type ProfileNotesLoadMoreLinkProps = {
  href: string;
  label: string;
  neo: boolean;
};

export function ProfileNotesLoadMoreLink({
  href,
  label,
  neo,
}: ProfileNotesLoadMoreLinkProps) {
  return (
    <NavLink
      href={href}
      className={cn(
        "rounded-full border border-[var(--border)] bg-[var(--background)] px-5 py-2.5 text-sm font-extrabold text-[var(--foreground)] no-underline transition-colors hover:bg-[var(--muted)]",
        neo && "neo-btn neo-btn--mint border-0",
      )}
    >
      {label}
    </NavLink>
  );
}
