"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { NavLink } from "@/components/navigation/nav-link";
import { Button } from "@/components/ui/button";
import { downsampleTo16kPcm16, pcm16ToBase64 } from "@/features/live-note/pcm";
import { saveTranscriptSession } from "@/features/live-note/save-transcript-session";
import {
  type InterviewLevel,
  type InterviewQuestion,
  type InterviewTrack,
  getQuestionSet,
} from "@/features/interview/question-bank";
import {
  aggregateSessionScore,
  buildSessionReport,
  evaluateAnswer,
  type EvaluatedAnswer,
} from "@/features/interview/scoring";
import {
  InterviewSetupForm,
  type InterviewSetupValue,
} from "@/features/interview/interview-setup-form";
import { InterviewFeedbackCard } from "@/features/interview/interview-feedback-card";
import { InterviewSummaryReport } from "@/features/interview/interview-summary-report";

const DEFAULT_PROXY_WS =
  process.env.NEXT_PUBLIC_VALSEA_RT_PROXY_URL ?? "ws://127.0.0.1:3331";

type Props = {
  initialFolders: { id: string; name: string }[];
};

type InterviewMode = "setup" | "running" | "finished";
type RttMessage = { type?: string; text?: string; message?: string };

export function InterviewSessionPanel({ initialFolders }: Props) {
  const t = useTranslations("Interview");
  const [mode, setMode] = useState<InterviewMode>("setup");
  const [track, setTrack] = useState<InterviewTrack>("software_engineer");
  const [level, setLevel] = useState<InterviewLevel>("mid");
  const [language, setLanguage] = useState("english");
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [manualAnswer, setManualAnswer] = useState("");
  const [finalSegments, setFinalSegments] = useState<string[]>([]);
  const [partial, setPartial] = useState("");
  const [status, setStatus] = useState<string>(t("rttReady"));
  const [running, setRunning] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [entries, setEntries] = useState<EvaluatedAnswer[]>([]);
  const [saveFolderId, setSaveFolderId] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [savedNoteId, setSavedNoteId] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const currentQuestion = questions[index] ?? null;
  const transcriptText = useMemo(
    () => [...finalSegments, partial.trim()].filter(Boolean).join(" ").trim(),
    [finalSegments, partial],
  );
  const answerInput = transcriptText || manualAnswer.trim();
  const score = useMemo(() => aggregateSessionScore(entries), [entries]);

  const cleanRealtimeResources = useCallback(() => {
    processorRef.current?.disconnect();
    sourceRef.current?.disconnect();
    streamRef.current?.getTracks().forEach((trackItem) => trackItem.stop());
    void audioContextRef.current?.close().catch(() => {});
    processorRef.current = null;
    sourceRef.current = null;
    streamRef.current = null;
    audioContextRef.current = null;
  }, []);

  const stopCapture = useCallback(() => {
    const ws = wsRef.current;
    wsRef.current = null;
    if (ws && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify({ type: "audio.commit" }));
      } catch {
        // no-op
      }
      try {
        ws.send(JSON.stringify({ type: "session.stop" }));
      } catch {
        // no-op
      }
      ws.close(1000, "client_stop");
    }
    cleanRealtimeResources();
    setRunning(false);
    setStatus(t("rttStopped"));
  }, [cleanRealtimeResources, t]);

  const startCapture = useCallback(async () => {
    if (running) return;
    setError(null);
    setStatus(t("rttConnecting"));
    setFinalSegments([]);
    setPartial("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 48_000,
          noiseSuppression: true,
          echoCancellation: true,
        },
      });
      streamRef.current = stream;

      const ws = new WebSocket(DEFAULT_PROXY_WS);
      wsRef.current = ws;

      ws.onopen = async () => {
        ws.send(
          JSON.stringify({
            type: "session.start",
            language,
          }),
        );

        const audioContext = new AudioContext({ sampleRate: 48_000 });
        const source = audioContext.createMediaStreamSource(stream);
        const processor = audioContext.createScriptProcessor(4096, 1, 1);
        audioContextRef.current = audioContext;
        sourceRef.current = source;
        processorRef.current = processor;

        processor.onaudioprocess = (event) => {
          if (ws.readyState !== WebSocket.OPEN) return;
          const channel = event.inputBuffer.getChannelData(0);
          const pcm16 = downsampleTo16kPcm16(channel, audioContext.sampleRate);
          ws.send(
            JSON.stringify({
              type: "audio.chunk",
              audio: pcm16ToBase64(pcm16),
            }),
          );
        };

        source.connect(processor);
        processor.connect(audioContext.destination);
        setRunning(true);
        setStatus(t("rttRecording"));
      };

      ws.onmessage = (event) => {
        let parsed: RttMessage;
        try {
          parsed = JSON.parse(String(event.data)) as RttMessage;
        } catch {
          return;
        }
        if (parsed.type === "transcript.partial") {
          setPartial(parsed.text?.trim() ?? "");
        } else if (parsed.type === "transcript.final") {
          const text = parsed.text?.trim();
          if (!text) return;
          setFinalSegments((prev) => [...prev, text]);
          setPartial("");
        } else if (parsed.type === "error") {
          setError(parsed.message ?? t("rttFailed"));
        }
      };

      ws.onclose = () => {
        cleanRealtimeResources();
        setRunning(false);
        setStatus(t("rttStopped"));
      };
      ws.onerror = () => {
        setError(t("rttFailed"));
      };
    } catch {
      setError(t("rttMicError"));
      setStatus(t("rttReady"));
    }
  }, [cleanRealtimeResources, language, running, t]);

  const runTool = useCallback(
    async (tool: string, body: Record<string, unknown>) => {
      const res = await fetch("/api/valsea/tool", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool, ...body }),
      });
      const data = (await res.json().catch(() => null)) as Record<
        string,
        unknown
      > | null;
      if (!res.ok || !data || typeof data.error === "string") {
        throw new Error(
          (typeof data?.error === "string" && data.error) || t("toolFailed"),
        );
      }
      return data;
    },
    [t],
  );

  const onStartInterview = useCallback(
    (value: InterviewSetupValue) => {
      setTrack(value.track);
      setLevel(value.level);
      setLanguage(value.language);
      const seeded = getQuestionSet(value.track, value.level);
      setQuestions(seeded);
      setEntries([]);
      setIndex(0);
      setManualAnswer("");
      setFinalSegments([]);
      setPartial("");
      setSavedNoteId(null);
      setError(null);
      setStatus(t("rttReady"));
      setMode("running");
    },
    [t],
  );

  const onSubmitAnswer = useCallback(async () => {
    if (!currentQuestion || !answerInput || processing) return;
    setProcessing(true);
    setError(null);
    try {
      const clarify = await runTool("clarify", { text: answerInput, language });
      const clarifiedText =
        typeof clarify.clarified_text === "string"
          ? clarify.clarified_text.trim()
          : answerInput;
      const [notesRes, actionsRes, sentimentRes] = await Promise.all([
        runTool("format", {
          transcript: clarifiedText,
          output_type: "interview_notes",
        }),
        runTool("format", {
          transcript: clarifiedText,
          output_type: "action_items",
        }),
        runTool("sentiment", { transcript: clarifiedText }),
      ]);
      const evaluation = evaluateAnswer(clarifiedText, currentQuestion);
      const entry: EvaluatedAnswer = {
        questionId: currentQuestion.id,
        questionPrompt: currentQuestion.prompt,
        topic: currentQuestion.topic,
        rawAnswer: answerInput,
        clarifiedAnswer: clarifiedText,
        interviewNotes:
          typeof notesRes.formatted_text === "string"
            ? notesRes.formatted_text
            : "",
        actionItems:
          typeof actionsRes.formatted_text === "string"
            ? actionsRes.formatted_text
            : "",
        sentiment:
          typeof sentimentRes.sentiment === "string"
            ? sentimentRes.sentiment
            : "unknown",
        confidence:
          typeof sentimentRes.confidence === "number"
            ? sentimentRes.confidence
            : null,
        reasoning:
          typeof sentimentRes.reasoning === "string"
            ? sentimentRes.reasoning
            : "",
        evaluation,
      };
      setEntries((prev) => [...prev, entry]);
      setManualAnswer("");
      setFinalSegments([]);
      setPartial("");
      stopCapture();

      const isLast = index >= questions.length - 1;
      if (isLast) {
        setMode("finished");
      } else {
        setIndex((prev) => prev + 1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("toolFailed"));
    } finally {
      setProcessing(false);
    }
  }, [
    answerInput,
    currentQuestion,
    index,
    language,
    processing,
    questions.length,
    runTool,
    stopCapture,
    t,
  ]);

  const onSaveReport = useCallback(async () => {
    if (entries.length === 0 || saveLoading) return;
    setSaveLoading(true);
    setError(null);
    try {
      const report = buildSessionReport({
        trackLabel: t(`track_${track}`),
        levelLabel: t(`level_${level}`),
        languageLabel: t(`lang_${language}`),
        score,
        entries,
      });
      const result = await saveTranscriptSession({
        title: `${t("reportTitlePrefix")} - ${t(`track_${track}`)} - ${new Date().toLocaleDateString()}`,
        transcript: report,
        folderId: saveFolderId || undefined,
      });
      if (!result.ok) {
        throw new Error(
          result.code === "AUTH_REQUIRED"
            ? t("saveAuthRequired")
            : t("saveFailed"),
        );
      }
      setSavedNoteId(result.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("saveFailed"));
    } finally {
      setSaveLoading(false);
    }
  }, [entries, language, level, saveFolderId, saveLoading, score, t, track]);

  if (mode === "setup") {
    return <InterviewSetupForm onStart={onStartInterview} />;
  }

  if (mode === "finished") {
    return (
      <div className="space-y-5">
        <InterviewSummaryReport score={score} answers={entries} />
        <section className="rounded-2xl border-2 border-[var(--neo-ink)] bg-[var(--surface)] p-5 shadow-[6px_6px_0_0_var(--neo-raised)]">
          <h3 className="text-base font-extrabold">{t("saveReportTitle")}</h3>
          <p className="mt-1 text-sm text-[var(--muted-fg)]">
            {t("saveReportLead")}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <select
              value={saveFolderId}
              onChange={(e) => setSaveFolderId(e.target.value)}
              className="rounded-xl border-2 border-[var(--neo-ink)] bg-[var(--background)] px-3 py-2 text-sm font-bold shadow-[3px_3px_0_0_var(--neo-raised)] outline-none"
            >
              <option value="">{t("folderNone")}</option>
              {initialFolders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
            <Button
              className="neo-btn neo-btn--primary font-extrabold"
              loading={saveLoading}
              onClick={() => void onSaveReport()}
            >
              {t("saveReport")}
            </Button>
            <Button
              variant="ghost"
              className="neo-btn neo-btn--ghost font-extrabold"
              onClick={() => setMode("setup")}
            >
              {t("restart")}
            </Button>
          </div>
          {savedNoteId ? (
            <p className="mt-3 text-sm font-bold text-emerald-700 dark:text-emerald-400">
              {t("saveSuccess")}{" "}
              <NavLink
                href={`/profile/notes/${savedNoteId}`}
                className="underline underline-offset-2"
              >
                {t("openSavedNote")}
              </NavLink>
            </p>
          ) : null}
        </section>
        <section className="space-y-3">
          {entries.map((item, itemIndex) => (
            <InterviewFeedbackCard
              key={item.questionId}
              item={item}
              index={itemIndex}
            />
          ))}
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border-2 border-[var(--neo-ink)] bg-[var(--surface)] p-5 shadow-[6px_6px_0_0_var(--neo-raised)]">
        <p className="text-xs font-extrabold uppercase tracking-wide text-[var(--muted-fg)]">
          {t("questionLabel")} {index + 1}/{questions.length}
        </p>
        <h2 className="mt-1 text-xl font-extrabold">
          {currentQuestion?.prompt}
        </h2>
        <p className="mt-2 text-sm text-[var(--muted-fg)]">
          {currentQuestion?.followUpHint}
        </p>
      </section>

      <section className="rounded-2xl border-2 border-[var(--neo-ink)] bg-[var(--surface)] p-5 shadow-[6px_6px_0_0_var(--neo-raised)]">
        <div className="flex flex-wrap gap-2">
          <Button
            className="neo-btn neo-btn--primary font-extrabold"
            disabled={running}
            onClick={() => void startCapture()}
          >
            {t("startRecord")}
          </Button>
          <Button
            variant="ghost"
            className="neo-btn neo-btn--ghost font-extrabold"
            disabled={!running}
            onClick={() => stopCapture()}
          >
            {t("stopRecord")}
          </Button>
          <p className="self-center text-xs font-bold text-[var(--muted-fg)]">
            {t("statusLabel")}: {status}
          </p>
        </div>

        <label className="mt-4 block text-xs font-bold uppercase tracking-wide text-[var(--muted-fg)]">
          {t("transcriptLabel")}
        </label>
        <textarea
          value={transcriptText}
          readOnly
          className="mt-1.5 min-h-28 w-full rounded-xl border-2 border-[var(--neo-ink)] bg-[var(--background)] px-3 py-2.5 text-sm shadow-[3px_3px_0_0_var(--neo-raised)] outline-none"
        />

        <label className="mt-4 block text-xs font-bold uppercase tracking-wide text-[var(--muted-fg)]">
          {t("manualAnswerLabel")}
        </label>
        <textarea
          value={manualAnswer}
          onChange={(e) => setManualAnswer(e.target.value)}
          placeholder={t("manualAnswerPlaceholder")}
          className="mt-1.5 min-h-28 w-full rounded-xl border-2 border-[var(--neo-ink)] bg-[var(--background)] px-3 py-2.5 text-sm shadow-[3px_3px_0_0_var(--neo-raised)] outline-none"
        />

        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            className="neo-btn neo-btn--primary font-extrabold"
            loading={processing}
            disabled={!answerInput}
            onClick={() => void onSubmitAnswer()}
          >
            {t("submitAnswer")}
          </Button>
          <Button
            variant="ghost"
            className="neo-btn neo-btn--ghost font-extrabold"
            onClick={() => {
              stopCapture();
              setMode("setup");
            }}
          >
            {t("cancelSession")}
          </Button>
        </div>

        {error ? (
          <p
            className="mt-3 text-sm font-bold text-red-600 dark:text-red-400"
            role="alert"
          >
            {error}
          </p>
        ) : null}
      </section>

      {entries.length > 0 ? (
        <section className="space-y-3">
          {entries.map((item, itemIndex) => (
            <InterviewFeedbackCard
              key={item.questionId}
              item={item}
              index={itemIndex}
            />
          ))}
        </section>
      ) : null}
    </div>
  );
}
