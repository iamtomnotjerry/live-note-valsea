import { getTranslations } from "next-intl/server";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default async function LocaleSegmentLoading() {
  const t = await getTranslations("Loading");

  return (
    <div
      className="flex min-h-dvh flex-col bg-[var(--background)] text-[var(--foreground)]"
      aria-busy="true"
      aria-live="polite"
      aria-label={t("pageAria")}
    >
      <div className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Skeleton className="h-8 w-36 sm:w-44" />
          <div className="hidden flex-1 justify-center gap-4 sm:flex">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>
      <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-4 py-8 sm:px-6">
        <div className="space-y-3">
          <Skeleton className="h-4 w-28 rounded-lg" />
          <Skeleton className="h-10 w-full max-w-lg rounded-xl" />
          <Skeleton className="h-4 w-full max-w-2xl" />
          <Skeleton className="h-4 w-full max-w-xl" />
        </div>
        <Skeleton
          className={cn(
            "h-[min(22rem,50dvh)] w-full max-w-3xl rounded-2xl",
            "border border-[var(--border)]",
          )}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-24 rounded-xl sm:col-span-2 lg:col-span-1" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
      </main>
    </div>
  );
}
