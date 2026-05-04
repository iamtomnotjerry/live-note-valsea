import { cn } from "@/lib/utils";

const sizes = {
  sm: "h-3.5 w-3.5 border-2",
  md: "h-4 w-4 border-2",
  lg: "h-5 w-5 border-[2.5px]",
} as const;

export type SpinnerProps = {
  className?: string;
  size?: keyof typeof sizes;
  /** Announced when not decorative. */
  label?: string;
  /** Hides from the accessibility tree (e.g. link `pending` adornment). */
  decorative?: boolean;
};

export function Spinner({
  className,
  size = "md",
  label = "Loading",
  decorative = false,
}: SpinnerProps) {
  return (
    <span
      role={decorative ? "presentation" : "status"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : label}
      className={cn(
        "inline-block shrink-0 animate-spin rounded-full border-[var(--border)] border-t-[var(--action)]",
        sizes[size],
        className,
      )}
    />
  );
}
