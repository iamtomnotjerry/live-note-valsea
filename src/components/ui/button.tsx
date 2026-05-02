import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost";

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--action)] text-[var(--action-fg)] hover:opacity-90 focus-visible:outline-[var(--action)]",
  secondary:
    "border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--muted)] focus-visible:outline-[var(--ring)]",
  ghost:
    "text-[var(--foreground)] hover:bg-[var(--muted)] focus-visible:outline-[var(--ring)]",
};

export function buttonClassName(
  variant: ButtonVariant = "primary",
  className?: string,
) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
    variantClass[variant],
    className,
  );
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variant = "primary", type = "button", ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={buttonClassName(variant, className)}
        {...props}
      />
    );
  },
);
