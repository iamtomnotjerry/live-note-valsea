import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ProfilePanel } from "@/features/profile/profile-panel";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export async function generateMetadata() {
  const t = await getTranslations("Profile");
  return {
    title: t("accountPageTitle"),
    description: t("metaDescription"),
  };
}

export default async function ProfileAccountPage() {
  const t = await getTranslations("Profile");
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-8",
        "border-2 border-[var(--neo-ink)] shadow-[6px_6px_0_0_var(--neo-raised)]",
      )}
    >
      <header className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          {t("accountPageTitle")}
        </h1>
        <p className="mt-2 text-sm font-medium text-[var(--muted-fg)]">
          {t("accountPageLead")}
        </p>
      </header>
      <ProfilePanel user={user} tone="landing" />
    </div>
  );
}
