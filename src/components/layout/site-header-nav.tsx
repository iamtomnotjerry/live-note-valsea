"use client";

import { NavLink } from "@/components/navigation/nav-link";

type SiteHeaderNavProps = {
  navFeatures: string;
  navWhy: string;
  live: string;
  valseaApi: string;
};

export function SiteHeaderNav({
  navFeatures,
  navWhy,
  live,
  valseaApi,
}: SiteHeaderNavProps) {
  return (
    <>
      <NavLink
        href="/#features"
        className="hidden cursor-pointer text-[var(--muted-fg)] transition-colors duration-200 hover:text-[var(--foreground)] md:inline"
      >
        {navFeatures}
      </NavLink>
      <NavLink
        href="/#why"
        className="hidden cursor-pointer text-[var(--muted-fg)] transition-colors duration-200 hover:text-[var(--foreground)] lg:inline"
      >
        {navWhy}
      </NavLink>
      <NavLink
        href="/live"
        className="cursor-pointer text-[var(--muted-fg)] transition-colors duration-200 hover:text-[var(--foreground)]"
      >
        {live}
      </NavLink>
      <a
        href="https://valsea.ai/docs"
        className="hidden cursor-pointer text-[var(--muted-fg)] transition-colors duration-200 hover:text-[var(--foreground)] sm:inline"
        rel="noopener noreferrer"
        target="_blank"
      >
        {valseaApi}
      </a>
    </>
  );
}
