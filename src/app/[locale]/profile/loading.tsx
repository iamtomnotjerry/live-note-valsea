import { getTranslations } from "next-intl/server";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default async function ProfileSegmentLoading() {
  const t = await getTranslations("Loading");

  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-8",
        "border-2 border-[var(--neo-ink)] shadow-[6px_6px_0_0_var(--neo-raised)]",
      )}
      aria-busy="true"
      aria-live="polite"
      aria-label={t("pageAria")}
    >
      <header className="mb-8 space-y-3 border-b border-[var(--border)] pb-6">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-9 w-4/5 max-w-md rounded-lg" />
        <Skeleton className="h-4 w-full max-w-2xl" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-28 rounded-xl sm:h-32" />
        ))}
      </div>
    </div>
  );
}
