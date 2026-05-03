"use client";

import { useEffect } from "react";

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Keeps Tab / Shift+Tab inside `containerRef` while `active` is true.
 * Call from dialogs; pair with autoFocus on the first field separately.
 */
export function useDialogFocusTrap(
  active: boolean,
  containerRef: React.RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!active || !containerRef.current) return;

    function onKeyDown(ev: KeyboardEvent) {
      if (ev.key !== "Tab" || !containerRef.current) return;
      if (!containerRef.current.contains(document.activeElement)) return;
      const nodes = [
        ...containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ].filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const i = nodes.indexOf(document.activeElement as HTMLElement);
      if (ev.shiftKey) {
        if (i <= 0) {
          ev.preventDefault();
          last.focus();
        }
      } else {
        if (i === -1 || i >= nodes.length - 1) {
          ev.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [active, containerRef]);
}
