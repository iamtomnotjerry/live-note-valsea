"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import type {
  EvaluatedAnswer,
  ScoreBreakdown,
} from "@/features/interview/scoring";

type Props = {
  score: ScoreBreakdown;
  answers: EvaluatedAnswer[];
};

export function InterviewSummaryReport({ score, answers }: Props) {
  const t = useTranslations("Interview");

  const topImprovements = useMemo(() => {
    const set = new Set<string>();
    for (const item of answers) {
      for (const entry of item.evaluation.improvements) {
        if (set.size >= 3) break;
        set.add(entry);
      }
      if (set.size >= 3) break;
    }
    return [...set];
  }, [answers]);

  return (
    <section className="rounded-2xl border-2 border-[var(--neo-ink)] bg-[var(--surface)] p-5 shadow-[6px_6px_0_0_var(--neo-raised)] sm:p-6">
      <h2 className="text-xl font-extrabold tracking-tight">
        {t("summaryTitle")}
      </h2>
      <p className="mt-1 text-sm font-medium text-[var(--muted-fg)]">
        {t("summaryLead")}
      </p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        <Metric label={t("scoreOverall")} value={score.overall} />
        <Metric label={t("scoreClarity")} value={score.clarity} />
        <Metric label={t("scoreRelevance")} value={score.relevance} />
        <Metric label={t("scoreStructure")} value={score.structure} />
        <Metric label={t("scoreCommunication")} value={score.communication} />
      </div>

      <div className="mt-5">
        <p className="text-sm font-extrabold">{t("topImprovements")}</p>
        <ul className="mt-1 list-inside list-disc text-sm text-[var(--muted-fg)]">
          {topImprovements.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/35 px-3 py-2">
      <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--muted-fg)]">
        {label}
      </p>
      <p className="mt-1 text-lg font-extrabold">{value}/100</p>
    </div>
  );
}
