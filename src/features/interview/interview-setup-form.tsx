"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import type {
  InterviewLevel,
  InterviewTrack,
} from "@/features/interview/question-bank";

export type InterviewSetupValue = {
  track: InterviewTrack;
  level: InterviewLevel;
  language: string;
};

type Props = {
  onStart: (value: InterviewSetupValue) => void;
};

const TRACKS: InterviewTrack[] = [
  "software_engineer",
  "business_analyst",
  "qa_tester",
];
const LEVELS: InterviewLevel[] = ["intern", "junior", "mid", "senior"];
const LANGUAGES = ["english", "vietnamese", "korean"];

export function InterviewSetupForm({ onStart }: Props) {
  const t = useTranslations("Interview");
  const [track, setTrack] = useState<InterviewTrack>("software_engineer");
  const [level, setLevel] = useState<InterviewLevel>("mid");
  const [language, setLanguage] = useState("english");

  return (
    <section className="rounded-2xl border-2 border-[var(--neo-ink)] bg-[var(--surface)] p-5 shadow-[6px_6px_0_0_var(--neo-raised)] sm:p-6">
      <h2 className="text-xl font-extrabold tracking-tight">
        {t("setupTitle")}
      </h2>
      <p className="mt-1 text-sm font-medium text-[var(--muted-fg)]">
        {t("setupLead")}
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <label className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wide text-[var(--muted-fg)]">
            {t("trackLabel")}
          </span>
          <select
            value={track}
            onChange={(e) => setTrack(e.target.value as InterviewTrack)}
            className="w-full rounded-xl border-2 border-[var(--neo-ink)] bg-[var(--background)] px-3 py-2.5 text-sm font-bold text-[var(--foreground)] shadow-[3px_3px_0_0_var(--neo-raised)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            {TRACKS.map((item) => (
              <option key={item} value={item}>
                {t(`track_${item}`)}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wide text-[var(--muted-fg)]">
            {t("levelLabel")}
          </span>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as InterviewLevel)}
            className="w-full rounded-xl border-2 border-[var(--neo-ink)] bg-[var(--background)] px-3 py-2.5 text-sm font-bold text-[var(--foreground)] shadow-[3px_3px_0_0_var(--neo-raised)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            {LEVELS.map((item) => (
              <option key={item} value={item}>
                {t(`level_${item}`)}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wide text-[var(--muted-fg)]">
            {t("languageLabel")}
          </span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full rounded-xl border-2 border-[var(--neo-ink)] bg-[var(--background)] px-3 py-2.5 text-sm font-bold text-[var(--foreground)] shadow-[3px_3px_0_0_var(--neo-raised)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            {LANGUAGES.map((item) => (
              <option key={item} value={item}>
                {t(`lang_${item}`)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5">
        <Button
          className="neo-btn neo-btn--primary font-extrabold"
          onClick={() => onStart({ track, level, language })}
        >
          {t("startInterview")}
        </Button>
      </div>
    </section>
  );
}
