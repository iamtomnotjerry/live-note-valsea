"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import {
  localizedAppPath,
  sanitizeAuthRedirectPath,
} from "@/lib/auth-redirect";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

function isLoginRoute(path: string) {
  return path === "/login" || path.endsWith("/login");
}

type LoginFormProps = {
  /** Neo-clay landing look (parent needs `data-landing="true"`). */
  tone?: "default" | "landing";
  /** From `?next=` when user came from “Log in to save” on Live. */
  afterLoginPath?: string;
  /** Set when `/auth/callback` could not exchange the session. */
  showAuthCallbackError?: boolean;
};

export function LoginForm({
  tone = "default",
  afterLoginPath,
  showAuthCallbackError,
}: LoginFormProps) {
  const neo = tone === "landing";
  const t = useTranslations("Login");
  const pathname = usePathname();
  const locale = useLocale();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  /** Full path including locale prefix when needed (OAuth `next` + post-login redirect). */
  const redirectNext = useMemo(() => {
    if (afterLoginPath) {
      return sanitizeAuthRedirectPath(
        localizedAppPath(afterLoginPath, locale),
        "/live",
      );
    }
    const base =
      pathname && pathname !== "/" && !isLoginRoute(pathname)
        ? pathname
        : "/live";
    return sanitizeAuthRedirectPath(localizedAppPath(base, locale), "/live");
  }, [afterLoginPath, pathname, locale]);

  async function signInWithGoogle() {
    setBusy(true);
    setMessage(null);
    const origin = window.location.origin;
    const next = encodeURIComponent(redirectNext);
    const redirectTo = `${origin}/auth/callback?next=${next}`;

    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: { prompt: "select_account" },
        },
      });
      if (error) {
        setMessage(error.message);
        setBusy(false);
        return;
      }
      if (data.url) {
        window.location.assign(data.url);
        return;
      }
      setMessage(t("genericError"));
      setBusy(false);
    } catch (e) {
      const detail = e instanceof Error ? e.message : String(e);
      setMessage(detail || t("genericError"));
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      {showAuthCallbackError ? (
        <p
          className={cn(
            "rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-900 dark:text-amber-200",
            neo &&
              "border-2 border-amber-600/50 font-medium shadow-[3px_3px_0_0_color-mix(in_srgb,amber_30%,var(--neo-raised))]",
          )}
        >
          {t("callbackError")}
        </p>
      ) : null}
      <Button
        type="button"
        variant={neo ? "ghost" : "secondary"}
        className={cn(
          "w-full gap-3 py-3",
          !neo && "border border-[var(--border)]",
          neo &&
            "neo-btn neo-btn--sky border-0 font-extrabold shadow-[4px_4px_0_0_var(--neo-raised)]",
        )}
        loading={busy}
        aria-label={t("continueWithGoogleAria")}
        onClick={() => void signInWithGoogle()}
      >
        {!busy ? (
          <GoogleGlyph className="h-5 w-5 shrink-0" aria-hidden />
        ) : null}
        {busy ? t("redirecting") : t("continueWithGoogle")}
      </Button>
      {message ? (
        <p
          className={cn(
            "text-sm text-red-600 dark:text-red-400",
            neo &&
              "rounded-xl border-2 border-red-600/45 bg-red-500/10 px-3 py-2 font-medium shadow-[3px_3px_0_0_color-mix(in_srgb,red_28%,var(--neo-raised))]",
          )}
          role="alert"
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}

/** Simple multicolor “G” mark for the button (not an official Google lockup). */
function GoogleGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
