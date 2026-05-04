"use client";

import type { ComponentProps } from "react";
import { useLinkStatus } from "next/link";
import { Link } from "@/i18n/navigation";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export type NavLinkProps = ComponentProps<typeof Link>;

/**
 * Locale-aware `Link` with Next.js `useLinkStatus` pending UI (spinner + dimmed label).
 * Must stay a direct wrapper around `next/link` (via next-intl) so the hook resolves.
 */
export function NavLink({ className, children, ...props }: NavLinkProps) {
  return (
    <Link {...props} className={cn("relative", className)}>
      <NavLinkContent>{children}</NavLinkContent>
    </Link>
  );
}

function NavLinkContent({ children }: { children: React.ReactNode }) {
  const { pending } = useLinkStatus();
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-2",
        pending && "opacity-[0.72]",
      )}
    >
      {pending ? (
        <Spinner
          size="sm"
          decorative
          className="border-t-[var(--foreground)] opacity-90"
        />
      ) : null}
      <span className="min-w-0">{children}</span>
    </span>
  );
}
