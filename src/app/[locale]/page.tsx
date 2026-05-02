import { getTranslations } from "next-intl/server";
import { SiteHeader } from "@/components/layout/site-header";
import { buttonClassName } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";

export default async function HomePage() {
  const t = await getTranslations("Home");

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-4 py-12 sm:px-6">
        <section className="space-y-6" aria-labelledby="hero-heading">
          <p className="text-sm font-medium uppercase tracking-wider text-[var(--muted-fg)]">
            {t("kicker")}
          </p>
          <h1
            id="hero-heading"
            className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            {t("headline")}
          </h1>
          <p className="max-w-2xl text-pretty text-[var(--muted-fg)]">
            {t("subBefore")}{" "}
            <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 font-mono text-xs">
              docs/
            </code>{" "}
            {t("subAfter")}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link className={buttonClassName("primary")} href="/live">
              {t("ctaLive")}
            </Link>
            <a
              className={buttonClassName("secondary")}
              href="https://valsea.ai/docs"
              rel="noopener noreferrer"
              target="_blank"
            >
              {t("ctaDocs")}
            </a>
          </div>
        </section>

        <section
          className="grid gap-4 sm:grid-cols-2"
          aria-labelledby="stack-heading"
        >
          <h2 id="stack-heading" className="sr-only">
            {t("stackTitle")}
          </h2>
          <Card>
            <CardTitle>{t("cardFrontendTitle")}</CardTitle>
            <CardDescription>{t("cardFrontendBody")}</CardDescription>
          </Card>
          <Card>
            <CardTitle>{t("cardBackendTitle")}</CardTitle>
            <CardDescription>{t("cardBackendBody")}</CardDescription>
          </Card>
        </section>
      </main>
    </div>
  );
}
