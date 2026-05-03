import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";

type SiteFooterProps = {
  tone?: "default" | "landing";
};

export async function SiteFooter({ tone = "default" }: SiteFooterProps) {
  const t = await getTranslations("Footer");
  const year = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "py-12",
        tone === "landing"
          ? "border-t-[3px] border-[var(--neo-ink)] bg-[var(--neo-cream)]"
          : "border-t border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] backdrop-blur-sm",
      )}
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:gap-8">
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="text-base font-bold text-[var(--foreground)]">
            Live Note Taker
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-[var(--muted-fg)]">
            {t("tagline")}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-bold text-[var(--foreground)]">
            {t("colFeatures")}
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link
                className="cursor-pointer text-[var(--muted-fg)] transition-colors duration-200 hover:text-[var(--landing-accent)]"
                href="/live"
              >
                {t("linkLive")}
              </Link>
            </li>
            <li>
              <a
                className="cursor-pointer text-[var(--muted-fg)] transition-colors duration-200 hover:text-[var(--landing-accent)]"
                href="https://valsea.ai/docs"
                rel="noopener noreferrer"
                target="_blank"
              >
                {t("linkDocs")}
              </a>
            </li>
            <li>
              <Link
                className="cursor-pointer text-[var(--muted-fg)] transition-colors duration-200 hover:text-[var(--landing-accent)]"
                href="/#features"
              >
                {t("linkFeatures")}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold text-[var(--foreground)]">
            {t("colProject")}
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a
                className="cursor-pointer text-[var(--muted-fg)] transition-colors duration-200 hover:text-[var(--landing-accent)]"
                href="https://valsea.ai"
                rel="noopener noreferrer"
                target="_blank"
              >
                {t("linkHackathon")}
              </a>
            </li>
            <li>
              <a
                className="cursor-pointer text-[var(--muted-fg)] transition-colors duration-200 hover:text-[var(--landing-accent)]"
                href="https://github.com/iamtomnotjerry/live-note-valsea"
                rel="noopener noreferrer"
                target="_blank"
              >
                {t("linkRepo")}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold text-[var(--foreground)]">
            {t("colSupport")}
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link
                className="cursor-pointer text-[var(--muted-fg)] transition-colors duration-200 hover:text-[var(--landing-accent)]"
                href="/#stories"
              >
                {t("linkStories")}
              </Link>
            </li>
            <li>
              <Link
                className="cursor-pointer text-[var(--muted-fg)] transition-colors duration-200 hover:text-[var(--landing-accent)]"
                href="/#why"
              >
                {t("linkWhy")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div
        className={cn(
          "mx-auto mt-10 max-w-6xl px-4 pt-8 text-center text-xs text-[var(--muted-fg)] sm:px-6",
          tone === "landing"
            ? "border-t-2 border-[var(--neo-ink)]"
            : "border-t border-[var(--border)]",
        )}
      >
        {t("legal", { year })}
      </div>
    </footer>
  );
}
