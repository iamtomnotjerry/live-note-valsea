import { getLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ProfilePanel } from "@/features/profile/profile-panel";
import { localizedAppPath } from "@/lib/auth-redirect";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function generateMetadata() {
  const t = await getTranslations("Profile");
  return {
    title: t("title"),
    description: t("metaDescription"),
  };
}

export default async function ProfilePage() {
  const t = await getTranslations("Profile");
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const locale = await getLocale();
    const next = localizedAppPath("/profile", locale);
    const loginBase = localizedAppPath("/login", locale);
    redirect(`${loginBase}?next=${encodeURIComponent(next)}`);
  }

  return (
    <div
      data-landing="true"
      className="landing-gradient-bg flex min-h-dvh flex-col text-[var(--foreground)]"
    >
      <SiteHeader tone="landing" />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-10 sm:px-6">
        <div className="neo-card px-6 py-8 sm:px-8 sm:py-10">
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              {t("title")}
            </h1>
            <p className="mt-2 text-sm font-medium leading-relaxed text-[var(--muted-fg)]">
              {t("pageLead")}
            </p>
          </div>
          <ProfilePanel user={user} tone="landing" />
        </div>
      </main>
      <SiteFooter tone="landing" />
    </div>
  );
}
