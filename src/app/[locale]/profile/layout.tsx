import { getLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ProfileNav } from "@/features/profile/profile-nav";
import {
  profileAvatarUrl,
  profileDisplayName,
} from "@/features/profile/profile-user-meta";
import { localizedAppPath } from "@/lib/auth-redirect";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("Profile");
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const locale = await getLocale();
    const next = localizedAppPath("/profile/folders", locale);
    const loginBase = localizedAppPath("/login", locale);
    redirect(`${loginBase}?next=${encodeURIComponent(next)}`);
  }

  const name = profileDisplayName(user);
  const url = profileAvatarUrl(user);
  const email = user.email ?? "";
  const initials = (name ?? email).slice(0, 2).toUpperCase();

  return (
    <div
      data-landing="true"
      className="landing-gradient-bg flex min-h-dvh flex-col text-[var(--foreground)]"
    >
      <SiteHeader tone="landing" />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:gap-8 lg:py-8">
        <aside className="shrink-0 lg:w-56">
          <div
            className={cn(
              "mb-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm",
              "border-2 border-[var(--neo-ink)] shadow-[4px_4px_0_0_var(--neo-raised)]",
            )}
          >
            <div className="flex items-center gap-3">
              {url ? (
                // eslint-disable-next-line @next/next/no-img-element -- OAuth avatar URL
                <img
                  src={url}
                  alt=""
                  width={40}
                  height={40}
                  className="h-10 w-10 shrink-0 rounded-full border border-[var(--border)] object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[var(--neo-ink)] bg-[var(--muted)] text-xs font-extrabold">
                  {initials}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold">
                  {name ?? email}
                </p>
                <p className="truncate text-xs font-medium text-[var(--muted-fg)]">
                  {t("workspaceLabel")}
                </p>
              </div>
            </div>
          </div>
          <div
            className={cn(
              "rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-sm",
              "border-2 border-[var(--neo-ink)] shadow-[4px_4px_0_0_var(--neo-raised)]",
            )}
          >
            <ProfileNav />
          </div>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </main>
      <SiteFooter tone="landing" />
    </div>
  );
}
