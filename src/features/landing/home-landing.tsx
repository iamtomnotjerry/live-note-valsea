import { getTranslations } from "next-intl/server";
import { buttonClassName } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

function IconMic({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M12 14a3 3 0 003-3V5a3 3 0 10-6 0v6a3 3 0 003 3z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M8 11v1a4 4 0 008 0v-1M12 18v3M9 21h6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconWave({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M4 12c2-4 4 4 6 0s4 4 6 0 4-4 4-4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconBook({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M5 5a2 2 0 012-2h10v16H7a2 2 0 00-2 2V5zM5 19a2 2 0 012-2h10"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconTrophy({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M8 21h8M12 17v4M7 4h10v3a5 5 0 01-10 0V4zM17 4h2v3a4 4 0 01-4 4M7 4H5v3a4 4 0 004 4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSpark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M12 3l1.09 5.26L18 9.5l-4.91 1.24L12 16l-1.09-5.26L6 9.5l4.91-1.24L12 3zM5 19l.5-2M19 19l-.5-2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarRating({ score, label }: { score: string; label: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex gap-0.5" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className="landing-star h-4 w-4 shrink-0 fill-current opacity-95"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </span>
      <span className="text-sm font-extrabold tabular-nums text-[var(--foreground)]">
        {score}
      </span>
      <span className="text-xs font-medium text-[var(--muted-fg)]">
        {label}
      </span>
    </div>
  );
}

export async function HomeLanding() {
  const t = await getTranslations("Home");

  const strip = [
    { Icon: IconMic, label: t("strip1Label"), sub: t("strip1Sub") },
    { Icon: IconBook, label: t("strip2Label"), sub: t("strip2Sub") },
    { Icon: IconTrophy, label: t("strip3Label"), sub: t("strip3Sub") },
  ];

  const catalog = [
    {
      title: t("cat1Title"),
      meta: t("cat1Meta"),
      desc: t("cat1Desc"),
      detail: t("cat1Detail"),
      Icon: IconMic,
      heroClass:
        "bg-gradient-to-br from-fuchsia-300/90 via-pink-200/90 to-rose-200/80 text-white dark:from-fuchsia-900/70 dark:via-pink-900/50 dark:to-rose-900/50",
    },
    {
      title: t("cat2Title"),
      meta: t("cat2Meta"),
      desc: t("cat2Desc"),
      detail: t("cat2Detail"),
      Icon: IconBook,
      heroClass:
        "bg-gradient-to-br from-violet-300/90 via-purple-200/85 to-indigo-200/80 text-white dark:from-violet-900/65 dark:via-purple-900/45 dark:to-indigo-900/50",
    },
    {
      title: t("cat3Title"),
      meta: t("cat3Meta"),
      desc: t("cat3Desc"),
      detail: t("cat3Detail"),
      Icon: IconWave,
      heroClass:
        "bg-gradient-to-br from-teal-300/90 via-emerald-200/85 to-cyan-200/80 text-white dark:from-teal-900/60 dark:via-emerald-900/45 dark:to-cyan-900/50",
    },
    {
      title: t("cat4Title"),
      meta: t("cat4Meta"),
      desc: t("cat4Desc"),
      detail: t("cat4Detail"),
      Icon: IconTrophy,
      heroClass:
        "bg-gradient-to-br from-amber-300/90 via-orange-200/85 to-yellow-200/80 text-amber-950 dark:from-amber-900/50 dark:via-orange-900/40 dark:to-yellow-900/35 dark:text-amber-100",
    },
  ] as const;

  const why = [
    { title: t("why1Title"), body: t("why1Body") },
    { title: t("why2Title"), body: t("why2Body") },
    { title: t("why3Title"), body: t("why3Body") },
    { title: t("why4Title"), body: t("why4Body") },
  ];

  const stories = [
    { quote: t("story1Quote"), name: t("story1Name"), role: t("story1Role") },
    { quote: t("story2Quote"), name: t("story2Name"), role: t("story2Role") },
    { quote: t("story3Quote"), name: t("story3Name"), role: t("story3Role") },
  ];

  return (
    <div className="flex flex-col">
      <div className="mx-auto w-full max-w-6xl flex-col px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-10">
        <section
          className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14"
          aria-labelledby="hero-heading"
        >
          <div className="space-y-7">
            <p className="clay-pill inline-flex items-center gap-2 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[var(--muted-fg)]">
              <IconSpark className="h-4 w-4 text-[var(--landing-accent)]" />
              {t("heroBadge")}
            </p>
            <h1
              id="hero-heading"
              className="text-balance font-extrabold tracking-tight text-[var(--foreground)]"
            >
              <span className="block text-[2.25rem] leading-[1.08] sm:text-5xl lg:text-[3.35rem]">
                {t("heroTitle1")}
              </span>
              <span className="mt-2 block text-[2.25rem] leading-[1.08] sm:text-5xl lg:text-[3.35rem]">
                {t("heroTitle2")}
              </span>
              <span className="mt-3 block bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-400 bg-clip-text text-[1.65rem] text-transparent sm:text-3xl dark:from-fuchsia-300 dark:via-pink-300 dark:to-rose-300">
                {t("heroTitle3")}
              </span>
            </h1>
            <p className="max-w-xl text-pretty text-base leading-relaxed text-[var(--muted-fg)] sm:text-lg">
              {t("heroSub")}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                className={buttonClassName(
                  "primary",
                  "cursor-pointer rounded-2xl px-7 py-3.5 text-base font-bold shadow-md shadow-fuchsia-500/20 transition duration-200 hover:shadow-lg hover:shadow-fuchsia-500/25 dark:shadow-fuchsia-900/40",
                )}
                href="/live"
              >
                {t("ctaLive")}
              </Link>
              <a
                className={buttonClassName(
                  "secondary",
                  "cursor-pointer rounded-2xl px-7 py-3.5 text-base font-bold transition duration-200",
                )}
                href="https://valsea.ai/docs"
                rel="noopener noreferrer"
                target="_blank"
              >
                {t("ctaDocs")}
              </a>
            </div>
          </div>

          <div className="clay-card relative overflow-hidden p-6 sm:p-8">
            <div
              className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-pink-300/50 to-purple-300/40 blur-2xl dark:from-pink-600/20 dark:to-purple-600/20"
              aria-hidden
            />
            <p className="landing-kicker">{t("progressEyebrow")}</p>
            <h2 className="mt-3 text-xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-2xl">
              {t("progressTitle")}
            </h2>
            <p className="mt-2 text-sm font-bold text-[var(--landing-accent)]">
              {t("progressLesson")}
            </p>
            <p className="mt-1 text-sm text-[var(--muted-fg)]">
              {t("progressMeta")}
            </p>
            <div
              className="mt-6 space-y-2"
              role="group"
              aria-label={t("progressAria")}
            >
              <div className="flex justify-between text-sm font-bold text-[var(--foreground)]">
                <span>{t("progressLabel")}</span>
                <span className="tabular-nums text-[var(--landing-accent)]">
                  {t("progressValue")}
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-[var(--muted)] ring-1 ring-[var(--border)]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-400 to-teal-400 transition-[width] duration-500 motion-reduce:transition-none"
                  style={{ width: "65%" }}
                />
              </div>
            </div>
            <Link
              className="mt-6 inline-flex cursor-pointer items-center gap-2 text-sm font-bold text-[var(--landing-accent)] transition-colors hover:text-[var(--landing-warm)]"
              href="/live"
            >
              {t("progressCta")}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </section>

        <ul
          className="mt-12 flex flex-wrap justify-center gap-3 sm:mt-14 sm:gap-4"
          aria-label={t("stripAria")}
        >
          {strip.map((s) => (
            <li key={s.label}>
              <div className="clay-pill flex items-center gap-3 px-4 py-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-200/80 to-violet-200/70 text-fuchsia-700 dark:from-fuchsia-900/50 dark:to-violet-900/50 dark:text-fuchsia-200">
                  <s.Icon className="h-5 w-5" />
                </span>
                <span className="text-left">
                  <span className="block text-sm font-extrabold text-[var(--foreground)]">
                    {s.label}
                  </span>
                  <span className="block text-xs text-[var(--muted-fg)]">
                    {s.sub}
                  </span>
                </span>
              </div>
            </li>
          ))}
        </ul>

        <section className="mt-16 sm:mt-20" aria-label={t("statsAria")}>
          <ul className="grid gap-4 sm:grid-cols-3">
            {[
              { v: t("stat1Value"), l: t("stat1Label") },
              { v: t("stat2Value"), l: t("stat2Label") },
              { v: t("stat3Value"), l: t("stat3Label") },
            ].map((s) => (
              <li key={s.l}>
                <div className="clay-card flex flex-col items-center px-5 py-8 text-center">
                  <span className="text-3xl font-extrabold tabular-nums tracking-tight text-[var(--foreground)] sm:text-4xl">
                    {s.v}
                  </span>
                  <span className="mt-2 max-w-[14rem] text-sm font-semibold leading-snug text-[var(--muted-fg)]">
                    {s.l}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section
        id="features"
        className="landing-section-muted scroll-mt-20 py-16 sm:scroll-mt-24 sm:py-20"
        aria-labelledby="catalog-heading"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="landing-kicker">{t("catalogEyebrow")}</p>
            <h2
              id="catalog-heading"
              className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-4xl"
            >
              {t("catalogTitle")}
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-[var(--muted-fg)]">
              {t("catalogSub")}
            </p>
          </div>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2">
            {catalog.map((c) => (
              <li key={c.title}>
                <article className="clay-card clay-card--interactive flex h-full flex-col overflow-hidden">
                  <div
                    className={`flex h-32 items-center justify-center sm:h-36 ${c.heroClass}`}
                  >
                    <c.Icon className="h-12 w-12 drop-shadow-md opacity-95" />
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <p className="text-xs font-bold text-[var(--muted-fg)]">
                      {c.detail}
                    </p>
                    <h3 className="text-lg font-extrabold text-[var(--foreground)]">
                      {c.title}
                    </h3>
                    <p className="text-sm font-semibold text-[var(--landing-accent)]">
                      {c.meta}
                    </p>
                    <p className="text-sm leading-relaxed text-[var(--muted-fg)]">
                      {c.desc}
                    </p>
                    <StarRating
                      score={t("ratingScore")}
                      label={t("ratingLabel")}
                    />
                  </div>
                </article>
              </li>
            ))}
          </ul>
          <div className="mt-10 text-center">
            <Link
              className="inline-flex cursor-pointer items-center gap-2 text-sm font-extrabold text-[var(--landing-accent)] transition-colors hover:text-[var(--landing-warm)]"
              href="/live"
            >
              {t("viewAll")}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <section
          id="why"
          className="scroll-mt-20 space-y-10 py-16 sm:scroll-mt-24 sm:py-20"
          aria-labelledby="why-heading"
        >
          <div className="mx-auto max-w-2xl text-center">
            <p className="landing-kicker">{t("whyEyebrow")}</p>
            <h2
              id="why-heading"
              className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-4xl"
            >
              {t("whyTitle")}
            </h2>
            <p className="mt-4 text-[var(--muted-fg)]">{t("whySub")}</p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {why.map((w) => (
              <li key={w.title}>
                <div className="clay-card h-full p-6">
                  <h3 className="font-extrabold text-[var(--foreground)]">
                    {w.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted-fg)]">
                    {w.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="stories"
          className="scroll-mt-20 space-y-10 pb-16 sm:scroll-mt-24 sm:pb-20"
          aria-labelledby="stories-heading"
        >
          <div className="mx-auto max-w-2xl text-center">
            <p className="landing-kicker">{t("storiesEyebrow")}</p>
            <h2
              id="stories-heading"
              className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-4xl"
            >
              {t("storiesTitle")}
            </h2>
          </div>
          <ul className="grid gap-5 lg:grid-cols-3">
            {stories.map((s) => (
              <li key={s.name}>
                <blockquote className="clay-card flex h-full flex-col p-6 sm:p-7">
                  <p className="flex-1 text-sm leading-relaxed text-[var(--foreground)]">
                    &ldquo;{s.quote}&rdquo;
                  </p>
                  <footer className="mt-6 flex items-center gap-3 border-t border-[var(--border)] pt-5">
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-400 to-pink-400 text-sm font-extrabold text-white dark:from-fuchsia-500 dark:to-pink-500"
                      aria-hidden
                    >
                      {s.name.charAt(0)}
                    </span>
                    <div className="min-w-0">
                      <cite className="not-italic text-sm font-bold text-[var(--foreground)]">
                        {s.name}
                      </cite>
                      <p className="text-xs text-[var(--muted-fg)]">{s.role}</p>
                    </div>
                  </footer>
                </blockquote>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="clay-card mb-16 px-6 py-12 text-center sm:mb-20 sm:px-12 sm:py-14"
          aria-labelledby="closing-heading"
        >
          <h2
            id="closing-heading"
            className="text-2xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-3xl"
          >
            {t("closingTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-pretty leading-relaxed text-[var(--muted-fg)]">
            {t("closingSub")}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              className={buttonClassName(
                "primary",
                "cursor-pointer rounded-2xl px-9 py-4 text-base font-bold shadow-md shadow-fuchsia-500/20 transition duration-200 hover:shadow-lg dark:shadow-fuchsia-900/40",
              )}
              href="/live"
            >
              {t("closingCta")}
            </Link>
            <a
              className={buttonClassName(
                "secondary",
                "cursor-pointer rounded-2xl px-9 py-4 text-base font-bold transition duration-200",
              )}
              href="https://valsea.ai/docs"
              rel="noopener noreferrer"
              target="_blank"
            >
              {t("closingSecondary")}
            </a>
          </div>
          <p className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-1 text-xs text-[var(--muted-fg)]">
            <span>{t("closingNote1")}</span>
            <span>{t("closingNote2")}</span>
          </p>
        </section>
      </div>
    </div>
  );
}
