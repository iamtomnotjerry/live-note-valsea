import { cn } from "@/lib/utils";

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Pulse placeholder for loading layouts and cards.
 * Prefer route-level `loading.tsx` plus targeted skeletons over blank screens.
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-[var(--muted)]",
        "motion-reduce:animate-none motion-reduce:bg-[var(--border)]",
        className,
      )}
      {...props}
    />
  );
}
