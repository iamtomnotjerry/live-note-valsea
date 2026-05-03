import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { HomeLanding } from "@/features/landing/home-landing";

export default function HomePage() {
  return (
    <div
      data-landing="true"
      className="landing-gradient-bg flex min-h-dvh flex-col text-[var(--foreground)]"
    >
      <SiteHeader tone="landing" />
      <main className="flex-1">
        <HomeLanding />
      </main>
      <SiteFooter tone="landing" />
    </div>
  );
}
