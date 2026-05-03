import { getTranslations } from "next-intl/server";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LiveRttPanel } from "@/features/live-note/live-rtt-panel";
import { Link } from "@/i18n/navigation";

export default async function LivePage() {
  const t = await getTranslations("LivePage");

  return (
    <div
      data-landing="true"
      className="landing-gradient-bg flex min-h-dvh flex-col text-[var(--foreground)]"
    >
      <SiteHeader tone="landing" />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              {t("title")}
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-[var(--muted-fg)]">
              {t("subtitle")}
            </p>
          </div>
          <Link
            className="neo-btn neo-btn--ghost shrink-0 text-sm no-underline"
            href="/"
          >
            {t("backHome")}
          </Link>
        </div>
        <LiveRttPanel tone="landing" />
      </main>
      <SiteFooter tone="landing" />
    </div>
  );
}
