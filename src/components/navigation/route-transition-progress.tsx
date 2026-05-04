"use client";

import { useEffect, useState } from "react";
import { usePathname } from "@/i18n/navigation";

/**
 * Thin indeterminate bar while a same-origin client navigation is in flight.
 * Complements App Router `loading.tsx` (which suspends on RSC); this fires on link intent.
 */
export function RouteTransitionProgress() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setActive(false);
    });
  }, [pathname]);

  useEffect(() => {
    function onClickCapture(ev: MouseEvent) {
      if (ev.defaultPrevented) return;
      if (ev.button !== 0) return;
      if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;

      const el = ev.target;
      if (!(el instanceof Element)) return;
      const anchor = el.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;

      let nextUrl: URL;
      try {
        nextUrl = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      if (nextUrl.origin !== window.location.origin) return;

      const current = `${window.location.pathname}${window.location.search}`;
      const target = `${nextUrl.pathname}${nextUrl.search}`;
      if (current === target) return;

      setActive(true);
    }

    document.addEventListener("click", onClickCapture, true);
    return () => document.removeEventListener("click", onClickCapture, true);
  }, []);

  if (!active) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[10000] h-[3px] overflow-hidden bg-[color-mix(in_srgb,var(--action)_22%,transparent)]"
      aria-hidden
    >
      <div className="h-full w-2/5 max-w-[12rem] bg-[var(--action)] shadow-[0_0_12px_color-mix(in_srgb,var(--action)_55%,transparent)] motion-reduce:!animate-none animate-route-bar" />
    </div>
  );
}
