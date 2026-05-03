import createMiddleware from "next-intl/middleware";
import { type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";

const handleI18n = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const response = handleI18n(request);
  return updateSession(request, response);
}

/**
 * `matcher` must be static strings (Next parse-time). Keep the `(vi|en|…)` group
 * in sync with `routing.locales` in `./i18n/routing.ts`.
 */
export const config = {
  matcher: [
    "/",
    "/(vi|en|id|th|ms)/:path*",
    "/((?!api|_next|_vercel|auth|.*\\..*).*)",
  ],
};
