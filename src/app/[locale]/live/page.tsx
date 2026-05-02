import { getTranslations } from "next-intl/server";
import { SiteHeader } from "@/components/layout/site-header";
import { buttonClassName } from "@/components/ui/button";
import { LiveRttPanel } from "@/features/live-note/live-rtt-panel";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

export default async function LivePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("LivePage");

  const asrLanguage = locale === "en" ? "english" : "vietnamese";

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {t("title")}
            </h1>
            <p className="mt-1 text-sm text-[var(--muted-fg)]">
              {t("subtitleBefore")}{" "}
              <code className="rounded bg-[var(--muted)] px-1 font-mono text-xs">
                npm run dev:rtt
              </code>
              {t("subtitleAfter")}
            </p>
          </div>
          <Link className={buttonClassName("ghost", "text-sm")} href="/">
            {t("backHome")}
          </Link>
        </div>
        <LiveRttPanel language={asrLanguage} />
      </main>
    </div>
  );
}
