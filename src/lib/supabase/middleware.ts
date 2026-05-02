import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { getPublicEnvOrNull } from "@/lib/env";

/**
 * Refreshes Supabase session cookies on each matched request.
 * When `response` is provided (e.g. from next-intl), cookies are applied to that
 * response so redirects and locale handling are preserved.
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export async function updateSession(
  request: NextRequest,
  response?: NextResponse,
) {
  const env = getPublicEnvOrNull();
  if (!env) {
    return response ?? NextResponse.next({ request });
  }

  const supabaseResponse = response ?? NextResponse.next({ request });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  await supabase.auth.getUser();

  return supabaseResponse;
}
