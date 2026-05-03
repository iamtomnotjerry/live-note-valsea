import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import {
  loginErrorRedirect,
  sanitizeAuthRedirectPath,
} from "@/lib/auth-redirect";
import { getPublicEnvOrNull } from "@/lib/env";

/**
 * OAuth (Google) callback: đổi `code` lấy session cookie, redirect về app (`next=`).
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const nextRaw = url.searchParams.get("next");
  const next = sanitizeAuthRedirectPath(nextRaw, "/live");

  const env = getPublicEnvOrNull();
  if (!env || !code) {
    return NextResponse.redirect(loginErrorRedirect(request));
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        },
      },
    },
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(loginErrorRedirect(request));
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
