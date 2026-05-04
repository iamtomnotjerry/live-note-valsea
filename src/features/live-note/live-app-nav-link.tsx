"use client";

import { NavLink } from "@/components/navigation/nav-link";

type LiveAppNavLinkProps = {
  href: "/" | "/live";
  className?: string;
  children: React.ReactNode;
};

export function LiveAppNavLink({
  href,
  className,
  children,
}: LiveAppNavLinkProps) {
  return (
    <NavLink href={href} className={className}>
      {children}
    </NavLink>
  );
}
