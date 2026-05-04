"use client";

import { NavLink } from "@/components/navigation/nav-link";
import type { TranscriptSessionListItem } from "@/features/profile/transcript-session-actions";
import { cn } from "@/lib/utils";

type LibraryNoteCardProps = {
  s: TranscriptSessionListItem;
  neo: boolean;
  untitled: string;
  /** Pre-formatted on the server (do not pass functions into this client component). */
  updatedLabel: string;
};

export function LibraryNoteCard({
  s,
  neo,
  untitled,
  updatedLabel,
}: LibraryNoteCardProps) {
  const title = (s.title?.trim() || untitled).slice(0, 120);
  return (
    <NavLink
      href={`/profile/notes/${s.id}`}
      className={cn(
        "block rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-left shadow-sm transition-all hover:border-[var(--foreground)]/25 hover:shadow-md",
        neo &&
          "border-2 border-[var(--neo-ink)] shadow-[4px_4px_0_0_var(--neo-raised)] hover:translate-y-[-1px]",
      )}
    >
      <p className="line-clamp-2 text-base font-extrabold leading-snug text-[var(--foreground)]">
        {title}
      </p>
      <p className="mt-2 text-xs font-medium text-[var(--muted-fg)]">
        {updatedLabel}
      </p>
    </NavLink>
  );
}
