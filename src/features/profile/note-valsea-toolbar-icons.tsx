/** Inline SVG icons for VALSEA note toolbar (no extra dependency). */

import { cn } from "@/lib/utils";

type IconProps = { className?: string };

function svgCls(base: string, className?: string) {
  return cn(base, className);
}

const stroke = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconClarify({ className }: IconProps) {
  return (
    <svg
      className={svgCls("size-5", className)}
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        {...stroke}
        d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"
      />
      <path {...stroke} d="M5 19h14M8 16h8" />
    </svg>
  );
}

export function IconTranslate({ className }: IconProps) {
  return (
    <svg
      className={svgCls("size-5", className)}
      viewBox="0 0 24 24"
      aria-hidden
    >
      <circle {...stroke} cx="12" cy="12" r="10" />
      <path {...stroke} d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20" />
    </svg>
  );
}

export function IconAnnotate({ className }: IconProps) {
  return (
    <svg
      className={svgCls("size-5", className)}
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path {...stroke} d="M4 20h4l10.5-10.5a2.12 2.12 0 0 0-3-3L5 17v3z" />
      <path {...stroke} d="M12.5 6.5l3 3" />
    </svg>
  );
}

export function IconConvert({ className }: IconProps) {
  return (
    <svg
      className={svgCls("size-5", className)}
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path {...stroke} d="M16 3h5v5M4 21v-5M21 3l-7 7M3 21l7-7" />
      <path {...stroke} d="M8 7H3V2" />
    </svg>
  );
}

export function IconFormat({ className }: IconProps) {
  return (
    <svg
      className={svgCls("size-5", className)}
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path {...stroke} d="M8 6h13M8 12h9M8 18h13M4 6h.01M4 12h.01M4 18h.01" />
    </svg>
  );
}

export function IconSentiment({ className }: IconProps) {
  return (
    <svg
      className={svgCls("size-5", className)}
      viewBox="0 0 24 24"
      aria-hidden
    >
      <circle {...stroke} cx="12" cy="12" r="10" />
      <path {...stroke} d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
    </svg>
  );
}

export function IconInfo({ className }: IconProps) {
  return (
    <svg
      className={svgCls("size-5", className)}
      viewBox="0 0 24 24"
      aria-hidden
    >
      <circle {...stroke} cx="12" cy="12" r="10" />
      <path {...stroke} d="M12 16v-5" />
      <circle cx="12" cy="8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconMic({ className }: IconProps) {
  return (
    <svg
      className={svgCls("size-5", className)}
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        {...stroke}
        d="M12 14a3 3 0 0 0 3-3V5a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3zM19 10v1a7 7 0 0 1-14 0v-1M12 18v4M8 22h8"
      />
    </svg>
  );
}

export function IconSpinner({ className }: IconProps) {
  return (
    <svg
      className={cn("size-5 animate-spin", className)}
      viewBox="0 0 24 24"
      aria-hidden
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
