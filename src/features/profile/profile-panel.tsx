import { getTranslations } from "next-intl/server";
import type { User } from "@supabase/supabase-js";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

function displayName(user: User): string | null {
  const meta = user.user_metadata as Record<string, string | undefined>;
  const raw = (meta.full_name ?? meta.name ?? "").trim();
  return raw || null;
}

function avatarUrl(user: User): string | undefined {
  const meta = user.user_metadata as Record<string, string | undefined>;
  return meta.avatar_url ?? meta.picture;
}

type ProfilePanelProps = {
  user: User;
  tone?: "default" | "landing";
};

export async function ProfilePanel({
  user,
  tone = "landing",
}: ProfilePanelProps) {
  const t = await getTranslations("Profile");
  const neo = tone === "landing";
  const name = displayName(user);
  const url = avatarUrl(user);
  const email = user.email ?? "—";

  return (
    <div className="space-y-6">
      <div
        className={cn(
          "flex flex-col items-center gap-4 sm:flex-row sm:items-start",
          neo && "sm:gap-6",
        )}
      >
        <div
          className={cn(
            "flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--border)] bg-[var(--surface)] text-2xl font-extrabold text-[var(--foreground)] shadow-sm",
            neo &&
              "border-2 border-[var(--neo-ink)] shadow-[4px_4px_0_0_var(--neo-raised)]",
          )}
        >
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element -- OAuth provider URL
            <img
              src={url}
              alt=""
              width={96}
              height={96}
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span aria-hidden>{(name ?? email).slice(0, 2).toUpperCase()}</span>
          )}
        </div>
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <p className="text-xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-2xl">
            {name ?? email}
          </p>
          <p className="mt-1 text-sm font-medium text-[var(--muted-fg)]">
            {t("subtitle")}
          </p>
        </div>
      </div>

      <dl
        className={cn(
          "divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm",
          neo &&
            "divide-[var(--neo-ink)] border-2 border-[var(--neo-ink)] shadow-[4px_4px_0_0_var(--neo-raised)]",
        )}
      >
        <div className="grid gap-1 px-4 py-3 sm:grid-cols-[minmax(0,10rem)_1fr] sm:items-center sm:gap-4">
          <dt className="text-xs font-bold uppercase tracking-wide text-[var(--muted-fg)]">
            {t("email")}
          </dt>
          <dd className="min-w-0 break-all font-semibold text-[var(--foreground)]">
            {email}
          </dd>
        </div>
        <div className="grid gap-1 px-4 py-3 sm:grid-cols-[minmax(0,10rem)_1fr] sm:items-center sm:gap-4">
          <dt className="text-xs font-bold uppercase tracking-wide text-[var(--muted-fg)]">
            {t("name")}
          </dt>
          <dd className="min-w-0 font-semibold text-[var(--foreground)]">
            {name ?? t("noName")}
          </dd>
        </div>
        <div className="grid gap-1 px-4 py-3 sm:grid-cols-[minmax(0,10rem)_1fr] sm:items-center sm:gap-4">
          <dt className="text-xs font-bold uppercase tracking-wide text-[var(--muted-fg)]">
            {t("userId")}
          </dt>
          <dd className="min-w-0 break-all font-mono text-xs font-semibold text-[var(--foreground)]">
            {user.id}
          </dd>
        </div>
        <div className="grid gap-1 px-4 py-3 sm:grid-cols-[minmax(0,10rem)_1fr] sm:items-center sm:gap-4">
          <dt className="text-xs font-bold uppercase tracking-wide text-[var(--muted-fg)]">
            {t("provider")}
          </dt>
          <dd className="font-semibold text-[var(--foreground)]">
            {t("providerGoogle")}
          </dd>
        </div>
      </dl>

      <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
        <Link
          href="/live"
          className={cn(
            "text-sm font-bold text-[var(--muted-fg)] underline-offset-4 transition-colors hover:text-[var(--foreground)] hover:underline",
            neo && "neo-btn neo-btn--ghost no-underline",
          )}
        >
          {t("backLive")}
        </Link>
      </div>
    </div>
  );
}
