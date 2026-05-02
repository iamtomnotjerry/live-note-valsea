import Link from "next/link";
import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  className?: string;
};

export function SiteHeader({ className }: SiteHeaderProps) {
  return (
    <header
      className={cn(
        "border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md",
        className,
      )}
    >
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-[var(--foreground)]"
        >
          Live Note
        </Link>
        <nav aria-label="Chính" className="flex items-center gap-4 text-sm">
          <Link
            href="/live"
            className="text-[var(--muted-fg)] transition-colors hover:text-[var(--foreground)]"
          >
            Live RTT
          </Link>
          <Link
            href="https://valsea.ai/docs"
            className="text-[var(--muted-fg)] transition-colors hover:text-[var(--foreground)]"
            rel="noopener noreferrer"
            target="_blank"
          >
            VALSEA API
          </Link>
        </nav>
      </div>
    </header>
  );
}
