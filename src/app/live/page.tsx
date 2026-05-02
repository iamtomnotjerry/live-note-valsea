import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { buttonClassName } from "@/components/ui/button";
import { LiveRttPanel } from "@/features/live-note/live-rtt-panel";

export default function LivePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              GhiLớp — nghe thầy, thấy chữ
            </h1>
            <p className="mt-1 text-sm text-[var(--muted-fg)]">
              VALSEA RTT (WebSocket + PCM 16 kHz). Dev: chạy{" "}
              <code className="rounded bg-[var(--muted)] px-1 font-mono text-xs">
                npm run dev:rtt
              </code>
              .
            </p>
          </div>
          <Link className={buttonClassName("ghost", "text-sm")} href="/">
            ← Trang chủ
          </Link>
        </div>
        <LiveRttPanel />
      </main>
    </div>
  );
}
