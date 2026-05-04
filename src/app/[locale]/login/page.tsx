import { getTranslations } from "next-intl/server";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LoginForm } from "@/features/auth/login-form";
import { LiveAppNavLink } from "@/features/live-note/live-app-nav-link";
import { trySanitizeAuthRedirect } from "@/lib/auth-redirect";

function safeInternalPath(p: string | undefined): string | undefined {
  if (!p?.trim()) return undefined;
  return trySanitizeAuthRedirect(p) ?? undefined;
}

type LoginPageProps = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const t = await getTranslations("Login");
  const q = await searchParams;
  const afterLoginPath = safeInternalPath(q.next);
  const showAuthCallbackError = q.error === "auth";

  return (
    <div
      data-landing="true"
      className="landing-gradient-bg flex min-h-dvh flex-col text-[var(--foreground)]"
    >
      <SiteHeader tone="landing" />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-10 sm:px-6">
        <div className="neo-card px-6 py-8 sm:px-8 sm:py-10">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                {t("title")}
              </h1>
              <p className="mt-2 text-sm font-medium leading-relaxed text-[var(--muted-fg)]">
                {t("subtitle")}
              </p>
            </div>
            <LiveAppNavLink
              className="neo-btn neo-btn--ghost shrink-0 text-sm no-underline"
              href="/live"
            >
              {t("backLive")}
            </LiveAppNavLink>
          </div>
          <LoginForm
            tone="landing"
            afterLoginPath={afterLoginPath}
            showAuthCallbackError={showAuthCallbackError}
          />
        </div>
      </main>
      <SiteFooter tone="landing" />
    </div>
  );
}
