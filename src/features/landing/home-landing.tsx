import { getTranslations } from "next-intl/server";
import { NavLink } from "@/components/navigation/nav-link";
import { LiveAppNavLink } from "@/features/live-note/live-app-nav-link";
import { cn } from "@/lib/utils";

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

function IconTarget({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="1.25" fill="currentColor" />
    </svg>
  );
}

function IconPlayCircle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path
        d="M10 8.5l6.5 3.5-6.5 3.5V8.5z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export async function HomeLanding() {
  const t = await getTranslations("Home");

  const strip = [
    {
      Icon: IconMic,
      label: t("strip1Label"),
      sub: t("strip1Sub"),
      tile: "bg-[var(--landing-sky)]",
    },
    {
      Icon: IconBook,
      label: t("strip2Label"),
      sub: t("strip2Sub"),
      tile: "bg-[var(--landing-lilac)]",
    },
    {
      Icon: IconTrophy,
      label: t("strip3Label"),
      sub: t("strip3Sub"),
      tile: "bg-[var(--landing-butter)]",
    },
  ];

  const catalog = [
    {
      title: t("cat1Title"),
      meta: t("cat1Meta"),
      desc: t("cat1Desc"),
      detail: t("cat1Detail"),
      Icon: IconMic,
      tile: "bg-rose-200 dark:bg-rose-900/50",
    },
    {
      title: t("cat2Title"),
      meta: t("cat2Meta"),
      desc: t("cat2Desc"),
      detail: t("cat2Detail"),
      Icon: IconBook,
      tile: "bg-sky-200 dark:bg-sky-900/50",
    },
    {
      title: t("cat3Title"),
      meta: t("cat3Meta"),
      desc: t("cat3Desc"),
      detail: t("cat3Detail"),
      Icon: IconWave,
      tile: "bg-violet-200 dark:bg-violet-900/50",
    },
    {
      title: t("cat4Title"),
      meta: t("cat4Meta"),
      desc: t("cat4Desc"),
      detail: t("cat4Detail"),
      Icon: IconTrophy,
      tile: "bg-emerald-200 dark:bg-emerald-900/50",
    },
    {
      title: t("cat5Title"),
      meta: t("cat5Meta"),
      desc: t("cat5Desc"),
      detail: t("cat5Detail"),
      Icon: IconTarget,
      tile: "bg-amber-200 dark:bg-amber-900/50",
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
            <p
              className="neo-pill inline-flex items-center gap-2 bg-[var(--landing-sky)] px-4 py-2 text-[11px] font-extrabold uppercase tracking-wider text-[var(--neo-btn-text)] motion-safe:animate-landing-fade-up motion-reduce:animate-none"
              style={{ animationDelay: "0ms" }}
            >
              <IconSpark className="h-4 w-4" />
              {t("heroBadge")}
            </p>
            <h1
              id="hero-heading"
              className="text-balance font-extrabold tracking-tight text-[var(--foreground)]"
            >
              <span
                className="block text-[2.25rem] leading-[1.08] sm:text-5xl lg:text-[3.35rem] motion-safe:animate-landing-fade-up motion-reduce:animate-none"
                style={{ animationDelay: "70ms" }}
              >
                {t("heroTitle1")}
              </span>
              <span
                className="mt-2 block text-[2.25rem] leading-[1.08] sm:text-5xl lg:text-[3.35rem] motion-safe:animate-landing-fade-up motion-reduce:animate-none"
                style={{ animationDelay: "140ms" }}
              >
                {t("heroTitle2")}
              </span>
              <span
                className="mt-3 block text-[1.65rem] font-extrabold text-[var(--landing-accent)] sm:text-3xl motion-safe:animate-landing-fade-up motion-reduce:animate-none"
                style={{ animationDelay: "210ms" }}
              >
                {t("heroTitle3")}
              </span>
            </h1>
            <p
              className="max-w-xl text-pretty text-base leading-relaxed text-[var(--muted-fg)] motion-safe:animate-landing-fade-up motion-reduce:animate-none sm:text-lg"
              style={{ animationDelay: "280ms" }}
            >
              {t("heroSub")}
            </p>
            <div
              className="flex flex-wrap gap-3 motion-safe:animate-landing-fade-up motion-reduce:animate-none"
              style={{ animationDelay: "360ms" }}
            >
              <NavLink className="neo-btn neo-btn--sky" href="/interview">
                {t("ctaInterview")}
                <span aria-hidden>→</span>
              </NavLink>
              <LiveAppNavLink className="neo-btn neo-btn--mint" href="/live">
                {t("ctaLive")}
                <span aria-hidden>→</span>
              </LiveAppNavLink>
              <a
                className="neo-btn neo-btn--sky"
                href="https://valsea.ai/docs"
                rel="noopener noreferrer"
                target="_blank"
              >
                {t("ctaDocs")}
              </a>
            </div>
          </div>

          <div className="neo-card relative overflow-hidden p-6 sm:p-8">
            <div
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.15rem]"
              aria-hidden
            >
              <div className="absolute -right-1 top-5 flex h-11 w-11 items-center justify-center rounded-lg border-2 border-[var(--neo-ink)] bg-[var(--landing-coral)] text-[var(--neo-btn-text)] shadow-[3px_3px_0_0_var(--neo-raised)] motion-safe:animate-landing-soft-float motion-reduce:animate-none">
                <IconTarget className="h-5 w-5" />
              </div>
              <div
                className="absolute bottom-16 left-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--neo-ink)] bg-[var(--landing-mint)] text-[var(--neo-btn-text)] shadow-[3px_3px_0_0_var(--neo-raised)] motion-safe:animate-landing-soft-float motion-reduce:animate-none"
                style={{ animationDelay: "0.4s" }}
              >
                <IconBook className="h-5 w-5" />
              </div>
              <div
                className="absolute bottom-6 right-3 flex h-10 w-10 items-center justify-center rounded-lg border-2 border-[var(--neo-ink)] bg-[var(--landing-butter)] text-[var(--neo-btn-text)] shadow-[3px_3px_0_0_var(--neo-raised)] motion-safe:animate-landing-soft-float motion-reduce:animate-none"
                style={{ animationDelay: "0.8s" }}
              >
                <IconTrophy className="h-5 w-5" />
              </div>
            </div>
            <p className="landing-kicker">{t("progressEyebrow")}</p>
            <div className="mt-3 flex items-start gap-3">
              <span className="neo-icon-tile mt-0.5 h-11 w-11 shrink-0 bg-[var(--landing-sky)] text-[var(--neo-btn-text)]">
                <IconPlayCircle className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <h2 className="text-xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-2xl">
                  {t("progressTitle")}
                </h2>
                <p className="mt-1 text-sm font-bold text-[var(--landing-accent)]">
                  {t("progressLesson")}
                </p>
              </div>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted-fg)]">
              {t("progressMeta")}
            </p>
            <div
              className="relative mt-5 rounded-xl border-2 border-[var(--neo-ink)] bg-[color-mix(in_srgb,var(--muted)_55%,var(--surface))] p-4 shadow-[4px_4px_0_0_var(--neo-raised)]"
              role="region"
              aria-label={t("livePreviewTranscriptAria")}
            >
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--muted-fg)]">
                {t("livePreviewTranscriptLabel")}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--foreground)]">
                {t("livePreviewFinal")}
              </p>
              <p className="mt-2 border-l-[3px] border-[var(--neo-ink)] pl-3 text-sm italic leading-relaxed text-[var(--foreground)] motion-safe:animate-landing-partial motion-reduce:animate-none motion-reduce:opacity-80">
                {t("livePreviewPartial")}
              </p>
            </div>
            <div
              className="mt-6 space-y-2"
              role="group"
              aria-label={t("progressAria")}
            >
              <div className="flex justify-between text-sm font-extrabold text-[var(--foreground)]">
                <span>{t("progressLabel")}</span>
                <span className="text-[var(--landing-accent)] motion-safe:animate-landing-partial motion-reduce:animate-none motion-reduce:opacity-80">
                  {t("progressValue")}
                </span>
              </div>
              <div className="neo-progress-track overflow-hidden p-0.5">
                <div className="h-full overflow-hidden rounded-full">
                  <div className="h-full min-h-[8px] rounded-full border-2 border-[var(--neo-ink)] bg-[var(--landing-mint)] motion-safe:animate-landing-progress motion-reduce:animate-none motion-reduce:w-[72%]" />
                </div>
              </div>
            </div>
            <LiveAppNavLink
              className="neo-btn neo-btn--mint mt-6 w-full text-sm sm:text-base"
              href="/live"
            >
              {t("progressCta")}
              <span aria-hidden>→</span>
            </LiveAppNavLink>
          </div>
        </section>

        <ul
          className="mt-12 flex flex-wrap justify-center gap-3 sm:mt-14 sm:gap-4"
          aria-label={t("stripAria")}
        >
          {strip.map((s, i) => (
            <li key={s.label}>
              <div
                className={cn(
                  "neo-pill flex items-center gap-3 bg-[var(--surface)] px-4 py-3 motion-safe:animate-landing-fade-up motion-reduce:animate-none",
                )}
                style={{ animationDelay: `${420 + i * 90}ms` }}
              >
                <span
                  className={cn(
                    "neo-icon-tile h-10 w-10 text-[var(--neo-btn-text)]",
                    s.tile,
                  )}
                >
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
                <div className="neo-card flex flex-col items-center px-5 py-8 text-center">
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
            {catalog.map((c, i) => (
              <li
                key={c.title}
                className="motion-safe:animate-landing-fade-up motion-reduce:animate-none"
                style={{ animationDelay: `${200 + i * 75}ms` }}
              >
                <article className="neo-card neo-card--interactive flex h-full flex-col p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={cn(
                        "neo-icon-tile h-12 w-12 shrink-0 text-[var(--neo-btn-text)]",
                        c.tile,
                      )}
                    >
                      <c.Icon className="h-6 w-6" />
                    </div>
                    <span className="neo-rating-pill flex items-center gap-1 px-2.5 py-1 text-[var(--foreground)]">
                      <svg
                        className="h-3.5 w-3.5 fill-[var(--landing-butter)]"
                        viewBox="0 0 20 20"
                        aria-hidden
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {t("ratingScore")}
                    </span>
                  </div>
                  <p className="mt-4 text-xs font-extrabold uppercase tracking-wide text-[var(--muted-fg)]">
                    {c.detail}
                  </p>
                  <h3 className="mt-1 text-lg font-extrabold text-[var(--foreground)]">
                    {c.title}
                  </h3>
                  <p className="text-sm font-bold text-[var(--landing-accent)]">
                    {c.meta}
                  </p>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--muted-fg)]">
                    {c.desc}
                  </p>
                  <p className="mt-4 text-xs font-bold text-[var(--muted-fg)]">
                    {t("ratingLabel")}
                  </p>
                </article>
              </li>
            ))}
          </ul>
          <div className="mt-10 text-center">
            <LiveAppNavLink
              className="neo-btn neo-btn--sky mx-auto text-sm"
              href="/live"
            >
              {t("viewAll")}
              <span aria-hidden>→</span>
            </LiveAppNavLink>
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
                <div className="neo-card neo-card--interactive h-full p-6">
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
                <blockquote className="neo-card neo-card--interactive flex h-full flex-col p-6 sm:p-7">
                  <span className="mb-3 flex gap-0.5" aria-hidden>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className="landing-star h-4 w-4 shrink-0 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </span>
                  <p className="flex-1 text-sm leading-relaxed text-[var(--foreground)]">
                    &ldquo;{s.quote}&rdquo;
                  </p>
                  <footer className="mt-6 flex items-center gap-3 border-t-2 border-[var(--neo-ink)] pt-5">
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[var(--neo-ink)] bg-[var(--landing-coral)] text-sm font-extrabold text-[var(--neo-btn-text)] shadow-[3px_3px_0_0_var(--neo-raised)]"
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
          className="neo-card mb-16 px-6 py-12 text-center motion-reduce:transition-none sm:mb-20 sm:px-12 sm:py-14"
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
            <NavLink
              className="neo-btn neo-btn--sky px-8 py-4"
              href="/interview"
            >
              {t("closingInterviewCta")}
              <span aria-hidden>→</span>
            </NavLink>
            <LiveAppNavLink
              className="neo-btn neo-btn--mint px-8 py-4"
              href="/live"
            >
              {t("closingCta")}
              <span aria-hidden>→</span>
            </LiveAppNavLink>
            <a
              className="neo-btn neo-btn--sky px-8 py-4"
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
