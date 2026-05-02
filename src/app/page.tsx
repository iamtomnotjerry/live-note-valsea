import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { buttonClassName } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-4 py-12 sm:px-6">
        <section className="space-y-6" aria-labelledby="hero-heading">
          <p className="text-sm font-medium uppercase tracking-wider text-[var(--muted-fg)]">
            GhiLớp · VALSEA EdTech Hackathon
          </p>
          <h1
            id="hero-heading"
            className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Nghe giảng — chữ hiện ngay. Ghi chép lớp học realtime với VALSEA.
          </h1>
          <p className="max-w-2xl text-pretty text-[var(--muted-fg)]">
            Fullstack Next.js + Supabase + Vercel: TypeScript strict, tài liệu
            trong{" "}
            <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 font-mono text-xs">
              docs/
            </code>{" "}
            để Cursor và đội ngũ đọc cùng một bản đồ.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link className={buttonClassName("primary")} href="/live">
              Bắt đầu GhiLớp
            </Link>
            <Link
              className={buttonClassName("secondary")}
              href="https://valsea.ai/docs"
              rel="noopener noreferrer"
              target="_blank"
            >
              Tài liệu VALSEA
            </Link>
          </div>
        </section>

        <section
          className="grid gap-4 sm:grid-cols-2"
          aria-labelledby="stack-heading"
        >
          <h2 id="stack-heading" className="sr-only">
            Kiến trúc kỹ thuật
          </h2>
          <Card>
            <CardTitle>Frontend</CardTitle>
            <CardDescription>
              App Router, Server Components mặc định, Client Components khi cần
              tương tác. Tiện ích{" "}
              <span className="font-mono text-xs">cn()</span> gom class
              Tailwind.
            </CardDescription>
          </Card>
          <Card>
            <CardTitle>Backend & dữ liệu</CardTitle>
            <CardDescription>
              Supabase (Postgres + Auth). Client server-side và browser tách
              file; middleware làm mới session.
            </CardDescription>
          </Card>
        </section>
      </main>
    </div>
  );
}
