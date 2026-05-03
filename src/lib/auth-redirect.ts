import type { NextRequest } from "next/server";
import { routing, type AppLocale } from "@/i18n/routing";

const APP_SEGMENTS = new Set(["live", "login", "profile"]);

const NOTE_SESSION_UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isNoteSessionUuid(s: string): boolean {
  return NOTE_SESSION_UUID.test(s);
}

function firstSegment(pathname: string): string | undefined {
  return pathname.split("/").filter(Boolean)[0];
}

export function hasLocalePrefix(pathname: string): boolean {
  const seg = firstSegment(pathname);
  return seg != null && routing.locales.includes(seg as AppLocale);
}

/** `/profile/...` after optional locale segment. */
function sanitizeProfileTail(rest: string[]): string | null {
  if (rest.length === 0) return "/profile/folders";
  const [p, ...more] = rest;
  if (p !== "profile") return null;
  if (more.length === 0) return "/profile/folders";
  const a = more[0];
  if (a === "account" && more.length === 1) return "/profile/account";
  if (a === "folders" && more.length === 1) return "/profile/folders";
  if (
    a === "folders" &&
    more.length === 2 &&
    (more[1] === "uncategorized" || isNoteSessionUuid(more[1]!))
  ) {
    return `/profile/folders/${more[1]}`;
  }
  if (a === "notes" && more.length === 1) return "/profile/notes";
  if (a === "notes" && more.length === 2 && isNoteSessionUuid(more[1]!)) {
    return `/profile/notes/${more[1]}`;
  }
  return null;
}

/**
 * Returns normalized safe path, or `null` if `raw` is not an allowed same-origin path.
 */
export function trySanitizeAuthRedirect(raw: string): string | null {
  const path = raw.trim();
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("://")) {
    return null;
  }
  let pathname: string;
  try {
    pathname = new URL(path, "https://example.invalid").pathname;
  } catch {
    return null;
  }
  if (pathname === "/") return "/";

  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return null;

  const [a, b] = parts;
  if (routing.locales.includes(a as AppLocale)) {
    if (parts.length === 1) return `/${a}`;
    if (parts.length === 2 && APP_SEGMENTS.has(b!)) return `/${a}/${b}`;
    const tail = sanitizeProfileTail(parts.slice(1));
    if (tail) return `/${a}${tail}`;
    return null;
  }

  const profilePath = sanitizeProfileTail(parts);
  if (profilePath) return profilePath;

  if (parts.length === 1 && APP_SEGMENTS.has(a!)) return `/${a}`;
  return null;
}

export function sanitizeAuthRedirectPath(
  raw: string | null | undefined,
  fallback = "/live",
): string {
  if (raw == null || !String(raw).trim()) return fallback;
  return trySanitizeAuthRedirect(String(raw)) ?? fallback;
}

/**
 * Prefix pathname from next-intl (`usePathname()` is **without** locale) for OAuth `next=`.
 * Paths that already start with a locale segment are returned unchanged.
 */
export function localizedAppPath(
  pathnameWithoutLocale: string,
  locale: string,
): string {
  const path = pathnameWithoutLocale.startsWith("/")
    ? pathnameWithoutLocale
    : `/${pathnameWithoutLocale}`;
  if (hasLocalePrefix(path)) return path;
  if (locale === routing.defaultLocale) return path;
  if (path === "/") return `/${locale}`;
  return `/${locale}${path}`;
}

/** After failed OAuth exchange: honor UI locale from next-intl cookie when possible. */
export function loginErrorRedirect(request: NextRequest): URL {
  const origin = request.nextUrl.origin;
  const raw = request.cookies.get("NEXT_LOCALE")?.value;
  if (
    raw &&
    routing.locales.includes(raw as AppLocale) &&
    raw !== routing.defaultLocale
  ) {
    return new URL(`/${raw}/login?error=auth`, origin);
  }
  return new URL(`/login?error=auth`, origin);
}
