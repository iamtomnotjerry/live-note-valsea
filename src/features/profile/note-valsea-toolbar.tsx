"use client";

import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useCallback, useId, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VALSEA_RTT_LANGUAGE_CODES } from "@/features/live-note/valsea-rtt-language-options";
import {
  IconAnnotate,
  IconClarify,
  IconConvert,
  IconFormat,
  IconInfo,
  IconMic,
  IconSentiment,
  IconSpinner,
  IconTranslate,
} from "@/features/profile/note-valsea-toolbar-icons";

const VALSEA_GUIDE_ROWS = [
  ["clarify", "editorValseaClarify"],
  ["translate", "editorValseaTranslate"],
  ["annotate", "editorValseaAnnotate"],
  ["convert", "editorValseaConvert"],
  ["format", "editorValseaFormat"],
  ["sentiment", "editorValseaSentiment"],
  ["transcribe", "editorValseaTranscribe"],
] as const;

const FORMAT_TYPES = [
  "meeting_minutes",
  "sales_summary",
  "service_log",
  "subtitles",
  "email_summary",
  "action_items",
  "key_quotes",
  "interview_notes",
] as const;

const TRANSLATE_TARGETS = [
  "vietnamese",
  "english",
  "thai",
  "indonesian",
  "malay",
  "chinese-simplified",
  "chinese-traditional",
  "japanese",
  "korean",
  "french",
  "spanish",
  "german",
  "hindi",
  "singlish",
  "english-us",
  "cantonese",
] as const;

function defaultTranslateTarget(locale: string): string {
  const m: Record<string, string> = {
    vi: "vietnamese",
    en: "english",
    id: "indonesian",
    th: "thai",
    ms: "malay",
  };
  return m[locale] ?? "english";
}

function ToolbarIconButton({
  label,
  ariaLabel,
  disabled,
  busy,
  onClick,
  icon,
  neo,
}: {
  label: string;
  ariaLabel: string;
  disabled?: boolean;
  busy?: boolean;
  onClick: () => void;
  icon: ReactNode;
  neo?: boolean;
}) {
  return (
    <span className="group/vt relative inline-flex">
      <Button
        type="button"
        variant="ghost"
        aria-label={ariaLabel}
        aria-busy={busy ? true : undefined}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          "relative size-10 shrink-0 p-0 text-[var(--foreground)] [&_svg]:pointer-events-none [&_svg]:shrink-0",
          neo &&
            "neo-btn neo-btn--ghost border-2 font-extrabold shadow-[3px_3px_0_0_var(--neo-raised)]",
          !neo &&
            "rounded-xl border border-[var(--border)] hover:bg-[var(--muted)]",
        )}
      >
        {busy ? <IconSpinner className="size-5" /> : icon}
      </Button>
      <span
        aria-hidden
        className="pointer-events-none invisible absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-[var(--neo-ink)] bg-[var(--surface)] px-2.5 py-1.5 text-[10px] font-extrabold leading-tight text-[var(--foreground)] opacity-0 shadow-[3px_3px_0_0_var(--neo-raised)] transition-opacity duration-150 group-hover/vt:visible group-hover/vt:opacity-100 group-focus-within/vt:visible group-focus-within/vt:opacity-100"
      >
        {label}
      </span>
    </span>
  );
}

type Props = {
  transcript: string;
  setTranscript: Dispatch<SetStateAction<string>>;
  setMessage: (v: string | null) => void;
  setError: (v: string | null) => void;
  neo?: boolean;
};

export function NoteValseaToolbar({
  transcript,
  setTranscript,
  setMessage,
  setError,
  neo = true,
}: Props) {
  const t = useTranslations("Profile");
  const tLang = useTranslations("Rtt.lang");
  const locale = useLocale();
  const fileRef = useRef<HTMLInputElement>(null);
  const guideRef = useRef<HTMLDialogElement>(null);
  const guideTitleId = useId();
  const guideTableSectionId = useId();

  const openGuide = useCallback(() => {
    guideRef.current?.showModal();
  }, []);

  const closeGuide = useCallback(() => {
    guideRef.current?.close();
  }, []);

  const [busy, setBusy] = useState<string | null>(null);
  const [translateTarget, setTranslateTarget] = useState(() =>
    defaultTranslateTarget(locale),
  );
  const [formatType, setFormatType] =
    useState<(typeof FORMAT_TYPES)[number]>("meeting_minutes");
  const [transcribeLang, setTranscribeLang] = useState("english");

  const hasText = transcript.trim().length > 0;

  const runTool = useCallback(
    async (
      tool: string,
      body: Record<string, unknown>,
      onResult: (data: Record<string, unknown>) => void,
    ) => {
      setBusy(tool);
      setError(null);
      setMessage(null);
      try {
        const res = await fetch("/api/valsea/tool", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tool, ...body }),
        });
        const data = (await res.json().catch(() => null)) as Record<
          string,
          unknown
        > | null;
        if (!res.ok || !data) {
          const errField = data?.error;
          const apiErr =
            typeof errField === "string" && errField.trim()
              ? errField.trim()
              : null;
          setError(
            apiErr ??
              (res.status === 503
                ? t("editorValseaNotConfigured")
                : t("editorValseaFailed")),
          );
          return;
        }
        if (typeof data.error === "string") {
          setError(data.error);
          return;
        }
        onResult(data);
      } catch {
        setError(t("editorValseaFailed"));
      } finally {
        setBusy(null);
      }
    },
    [setError, setMessage, t],
  );

  const iconClass = "size-5 shrink-0";

  return (
    <div className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/25 p-3 sm:p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-extrabold uppercase tracking-wide text-[var(--foreground)]">
            {t("editorValseaTitle")}
          </p>
          <p className="mt-1 text-xs font-medium text-[var(--muted-fg)]">
            {t("editorValseaHint")}
          </p>
        </div>
        <ToolbarIconButton
          label={t("editorValseaGuideInfo")}
          ariaLabel={t("editorValseaGuideInfoAria")}
          neo={neo}
          onClick={openGuide}
          icon={<IconInfo className={iconClass} />}
        />
      </div>

      <div className="flex flex-wrap items-end gap-3 sm:gap-4">
        <div className="group/sel relative flex min-w-0 items-center gap-1.5">
          <span className="shrink-0 text-[var(--muted-fg)]">
            <IconTranslate className="size-4" aria-hidden />
          </span>
          <select
            value={translateTarget}
            onChange={(e) => setTranslateTarget(e.target.value)}
            title={t("editorValseaTranslateLabel")}
            aria-label={t("editorValseaTranslateLabel")}
            className={cn(
              "max-w-[11rem] rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 py-1.5 text-xs font-bold text-[var(--foreground)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
              neo &&
                "border-2 border-[var(--neo-ink)] shadow-[2px_2px_0_0_var(--neo-raised)]",
            )}
          >
            {TRANSLATE_TARGETS.map((code) => (
              <option key={code} value={code}>
                {tLang(code)}
              </option>
            ))}
          </select>
          <span
            aria-hidden
            className="pointer-events-none invisible absolute left-0 top-full z-20 mt-1.5 max-w-[min(18rem,85vw)] rounded-lg border border-[var(--neo-ink)] bg-[var(--surface)] px-2 py-1 text-[10px] font-extrabold text-[var(--foreground)] opacity-0 shadow-[3px_3px_0_0_var(--neo-raised)] transition-opacity group-hover/sel:visible group-hover/sel:opacity-100 group-focus-within/sel:visible group-focus-within/sel:opacity-100"
          >
            {t("editorValseaTranslateLabel")}
          </span>
        </div>

        <div className="group/sel2 relative flex min-w-0 items-center gap-1.5">
          <span className="shrink-0 text-[var(--muted-fg)]">
            <IconFormat className="size-4" aria-hidden />
          </span>
          <select
            value={formatType}
            onChange={(e) =>
              setFormatType(e.target.value as (typeof FORMAT_TYPES)[number])
            }
            title={t("editorValseaFormatLabel")}
            aria-label={t("editorValseaFormatLabel")}
            className={cn(
              "max-w-[12rem] rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 py-1.5 text-xs font-bold text-[var(--foreground)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
              neo &&
                "border-2 border-[var(--neo-ink)] shadow-[2px_2px_0_0_var(--neo-raised)]",
            )}
          >
            {FORMAT_TYPES.map((id) => (
              <option key={id} value={id}>
                {t(`editorValseaFmt_${id}`)}
              </option>
            ))}
          </select>
          <span
            aria-hidden
            className="pointer-events-none invisible absolute left-0 top-full z-20 mt-1.5 max-w-[min(18rem,85vw)] rounded-lg border border-[var(--neo-ink)] bg-[var(--surface)] px-2 py-1 text-[10px] font-extrabold text-[var(--foreground)] opacity-0 shadow-[3px_3px_0_0_var(--neo-raised)] transition-opacity group-hover/sel2:visible group-hover/sel2:opacity-100 group-focus-within/sel2:visible group-focus-within/sel2:opacity-100"
          >
            {t("editorValseaFormatLabel")}
          </span>
        </div>

        <div className="group/sel3 relative flex min-w-0 items-center gap-1.5">
          <span className="shrink-0 text-[var(--muted-fg)]">
            <IconMic className="size-4" aria-hidden />
          </span>
          <select
            value={transcribeLang}
            onChange={(e) => setTranscribeLang(e.target.value)}
            title={t("editorValseaAudioLang")}
            aria-label={t("editorValseaAudioLang")}
            className={cn(
              "max-w-[10rem] rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 py-1.5 text-xs font-bold text-[var(--foreground)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
              neo &&
                "border-2 border-[var(--neo-ink)] shadow-[2px_2px_0_0_var(--neo-raised)]",
            )}
          >
            {VALSEA_RTT_LANGUAGE_CODES.map((code) => (
              <option key={code} value={code}>
                {tLang(code)}
              </option>
            ))}
          </select>
          <span
            aria-hidden
            className="pointer-events-none invisible absolute left-0 top-full z-20 mt-1.5 max-w-[min(18rem,85vw)] rounded-lg border border-[var(--neo-ink)] bg-[var(--surface)] px-2 py-1 text-[10px] font-extrabold text-[var(--foreground)] opacity-0 shadow-[3px_3px_0_0_var(--neo-raised)] transition-opacity group-hover/sel3:visible group-hover/sel3:opacity-100 group-focus-within/sel3:visible group-focus-within/sel3:opacity-100"
          >
            {t("editorValseaAudioLang")}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <ToolbarIconButton
          label={t("editorValseaClarify")}
          ariaLabel={t("editorValseaClarifyAria")}
          disabled={!!busy || !hasText}
          busy={busy === "clarify"}
          neo={neo}
          onClick={() =>
            void runTool("clarify", { text: transcript }, (d) => {
              const c = d.clarified_text;
              if (typeof c === "string" && c.trim()) setTranscript(c.trim());
            })
          }
          icon={<IconClarify className={iconClass} />}
        />
        <ToolbarIconButton
          label={t("editorValseaTranslate")}
          ariaLabel={t("editorValseaTranslateAria")}
          disabled={!!busy || !hasText}
          busy={busy === "translate"}
          neo={neo}
          onClick={() =>
            void runTool(
              "translate",
              { text: transcript, target: translateTarget, source: "auto" },
              (d) => {
                const c = d.translated_text;
                if (typeof c === "string" && c.trim()) setTranscript(c.trim());
              },
            )
          }
          icon={<IconTranslate className={iconClass} />}
        />
        <ToolbarIconButton
          label={t("editorValseaAnnotate")}
          ariaLabel={t("editorValseaAnnotateAria")}
          disabled={!!busy || !hasText}
          busy={busy === "annotate"}
          neo={neo}
          onClick={() =>
            void runTool(
              "annotate",
              { text: transcript, enable_correction: true, enable_tags: true },
              (d) => {
                const c = d.text;
                if (typeof c === "string" && c.trim()) setTranscript(c.trim());
              },
            )
          }
          icon={<IconAnnotate className={iconClass} />}
        />
        <ToolbarIconButton
          label={t("editorValseaConvert")}
          ariaLabel={t("editorValseaConvertAria")}
          disabled={!!busy || !hasText}
          busy={busy === "convert"}
          neo={neo}
          onClick={() =>
            void runTool("convert", { annotated_text: transcript }, (d) => {
              const c = d.converted_text;
              if (typeof c === "string" && c.trim()) setTranscript(c.trim());
            })
          }
          icon={<IconConvert className={iconClass} />}
        />
        <ToolbarIconButton
          label={t("editorValseaFormat")}
          ariaLabel={t("editorValseaFormatAria")}
          disabled={!!busy || !hasText}
          busy={busy === "format"}
          neo={neo}
          onClick={() =>
            void runTool(
              "format",
              { transcript, output_type: formatType },
              (d) => {
                const c = d.formatted_text;
                if (typeof c === "string" && c.trim()) setTranscript(c.trim());
              },
            )
          }
          icon={<IconFormat className={iconClass} />}
        />
        <ToolbarIconButton
          label={t("editorValseaSentiment")}
          ariaLabel={t("editorValseaSentimentAria")}
          disabled={!!busy || !hasText}
          busy={busy === "sentiment"}
          neo={neo}
          onClick={() =>
            void runTool("sentiment", { transcript }, (d) => {
              const s = typeof d.sentiment === "string" ? d.sentiment : "?";
              const conf =
                typeof d.confidence === "number" && !Number.isNaN(d.confidence)
                  ? Math.round(d.confidence * 100)
                  : null;
              const reasoning =
                typeof d.reasoning === "string" && d.reasoning.trim()
                  ? d.reasoning.trim().slice(0, 400)
                  : "";
              setMessage(
                t("editorValseaSentimentResult", {
                  sentiment: s,
                  pct: conf != null ? String(conf) : "—",
                  reasoning: reasoning ? `\n${reasoning}` : "",
                }),
              );
            })
          }
          icon={<IconSentiment className={iconClass} />}
        />
        <ToolbarIconButton
          label={t("editorValseaTranscribe")}
          ariaLabel={t("editorValseaTranscribeAria")}
          disabled={!!busy}
          busy={busy === "transcribe"}
          neo={neo}
          onClick={() => fileRef.current?.click()}
          icon={<IconMic className={iconClass} />}
        />
      </div>

      <dialog
        ref={guideRef}
        aria-labelledby={guideTitleId}
        className={cn(
          "z-[100] w-[min(40rem,calc(100vw-1.5rem))] max-w-[40rem] border-0 bg-transparent p-0 text-[var(--foreground)] [&::backdrop]:bg-black/55",
        )}
        onClick={(e) => {
          if (e.target === guideRef.current) closeGuide();
        }}
      >
        <div
          className={cn(
            "flex max-h-[min(85vh,100dvh)] flex-col overflow-hidden rounded-2xl border bg-[var(--surface)] shadow-xl",
            neo &&
              "border-2 border-[var(--neo-ink)] shadow-[6px_6px_0_0_var(--neo-raised)]",
            !neo && "border-[var(--border)]",
          )}
        >
          <div className="flex shrink-0 flex-wrap items-start justify-between gap-3 border-b border-[var(--border)] p-4 sm:p-5">
            <h2
              id={guideTitleId}
              className="max-w-[20rem] text-sm font-extrabold uppercase leading-snug tracking-wide sm:max-w-none"
            >
              {t("editorValseaGuideTitle")}
            </h2>
            <Button
              type="button"
              variant="secondary"
              className="shrink-0 text-xs font-extrabold sm:text-sm"
              onClick={closeGuide}
            >
              {t("editorValseaGuideClose")}
            </Button>
          </div>
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4 sm:p-5 text-xs leading-relaxed sm:text-sm">
            <p className="font-medium text-[var(--muted-fg)]">
              {t("editorValseaGuideIntro")}
            </p>
            <section className="space-y-2">
              <h3 className="text-[11px] font-extrabold uppercase tracking-wide text-[var(--foreground)] sm:text-xs">
                {t("editorValseaGuideBeforeTitle")}
              </h3>
              <ul className="list-inside list-disc space-y-1.5 text-[var(--muted-fg)]">
                <li>{t("editorValseaGuideBefore1")}</li>
                <li>{t("editorValseaGuideBefore2")}</li>
                <li>{t("editorValseaGuideBefore3")}</li>
                <li>{t("editorValseaGuideBefore4")}</li>
                <li>{t("editorValseaGuideBefore5")}</li>
              </ul>
            </section>
            <section className="space-y-2">
              <h3
                id={guideTableSectionId}
                className="text-[11px] font-extrabold uppercase tracking-wide text-[var(--foreground)] sm:text-xs"
              >
                {t("editorValseaGuideTableTitle")}
              </h3>
              <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
                <table
                  aria-labelledby={guideTableSectionId}
                  className="w-full min-w-[min(100%,20rem)] border-collapse text-left text-[11px] sm:text-xs"
                >
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--muted)]/50">
                      <th
                        scope="col"
                        className="w-[28%] p-2.5 font-extrabold text-[var(--foreground)] sm:p-3"
                      >
                        {t("editorValseaGuideColTool")}
                      </th>
                      <th
                        scope="col"
                        className="p-2.5 font-extrabold text-[var(--foreground)] sm:p-3"
                      >
                        {t("editorValseaGuideColDetail")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {VALSEA_GUIDE_ROWS.map(([id, labelKey]) => (
                      <tr
                        key={id}
                        className="border-b border-[var(--border)] last:border-b-0"
                      >
                        <td className="align-top p-2.5 font-bold text-[var(--foreground)] sm:p-3">
                          {t(labelKey)}
                        </td>
                        <td className="p-2.5 text-[var(--muted-fg)] sm:p-3">
                          {t(`editorValseaGuideDesc_${id}`)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </dialog>

      <input
        ref={fileRef}
        type="file"
        accept="audio/wav,audio/mpeg,audio/mp4,audio/x-m4a,audio/flac,audio/ogg,audio/webm,.wav,.mp3,.m4a,.flac,.ogg,.webm"
        className="sr-only"
        onChange={(ev) => {
          const file = ev.target.files?.[0];
          ev.target.value = "";
          if (!file) return;
          void (async () => {
            setBusy("transcribe");
            setError(null);
            setMessage(null);
            try {
              const fd = new FormData();
              fd.append("file", file);
              fd.append("language", transcribeLang);
              const res = await fetch("/api/valsea/transcribe", {
                method: "POST",
                body: fd,
              });
              const data = (await res.json().catch(() => null)) as {
                text?: string;
                error?: string;
              } | null;
              const errField = data?.error;
              const apiErr =
                typeof errField === "string" && errField.trim()
                  ? errField.trim()
                  : null;
              if (!res.ok || !data?.text?.trim()) {
                setError(
                  apiErr ??
                    (res.status === 503
                      ? t("editorValseaNotConfigured")
                      : t("editorValseaFailed")),
                );
                return;
              }
              const block = data.text.trim();
              setTranscript((prev) => {
                const p = prev.trim();
                return p ? `${p}\n\n${block}` : block;
              });
              setMessage(t("editorValseaTranscribeDone"));
            } catch {
              setError(t("editorValseaFailed"));
            } finally {
              setBusy(null);
            }
          })();
        }}
      />
    </div>
  );
}
