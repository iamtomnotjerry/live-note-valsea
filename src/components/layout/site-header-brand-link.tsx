"use client";

import { NavLink } from "@/components/navigation/nav-link";

type Props = {
  title: string;
  brandTitle: string;
  className?: string;
};

export function SiteHeaderBrandLink({ title, brandTitle, className }: Props) {
  return (
    <NavLink href="/" className={className} title={title}>
      {brandTitle}
    </NavLink>
  );
}
