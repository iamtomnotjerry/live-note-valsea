"use client";

import { useTranslations } from "next-intl";
import type { EvaluatedAnswer } from "@/features/interview/scoring";

type Props = {
  item: EvaluatedAnswer;
  index: number;
};

export function InterviewFeedbackCard({ item, index }: Props) {
  const t = useTranslations("Interview");
  const score = item.evaluation.score;

  return (
    <article className="rounded-2xl border-2 border-[var(--neo-ink)] bg-[var(--surface)] p-4 shadow-[5px_5px_0_0_var(--neo-raised)] sm:p-5">
      <p className="text-xs font-extrabold uppercase tracking-wide text-[var(--muted-fg)]">
        {t("questionLabel")} {index + 1}
      </p>
      <h3 className="mt-1 text-base font-extrabold">{item.questionPrompt}</h3>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <Metric label={t("scoreOverall")} value={score.overall} />
        <Metric label={t("scoreClarity")} value={score.clarity} />
        <Metric label={t("scoreRelevance")} value={score.relevance} />
        <Metric label={t("scoreStructure")} value={score.structure} />
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <p className="font-bold">{t("strengths")}</p>
        <ul className="list-inside list-disc text-[var(--muted-fg)]">
          {item.evaluation.strengths.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="pt-1 font-bold">{t("improvements")}</p>
        <ul className="list-inside list-disc text-[var(--muted-fg)]">
          {item.evaluation.improvements.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
    </article>
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
