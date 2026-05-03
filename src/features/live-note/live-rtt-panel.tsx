"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { buttonClassName } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { downsampleTo16kPcm16, pcm16ToBase64 } from "@/features/live-note/pcm";
import { saveTranscriptSession } from "@/features/live-note/save-transcript-session";
import { VALSEA_RTT_LANGUAGE_CODES } from "@/features/live-note/valsea-rtt-language-options";
import { localizedAppPath } from "@/lib/auth-redirect";
import { Link, usePathname } from "@/i18n/navigation";

const DEFAULT_PROXY_WS =
  process.env.NEXT_PUBLIC_VALSEA_RT_PROXY_URL ?? "ws://127.0.0.1:3331";

type RttServerMessage = {
  type: string;
  text?: string;
  message?: string;
  code?: string;
};

type Props = {
  className?: string;
  /** Neo-clay landing look (parent needs `data-landing="true"`). */
  tone?: "default" | "landing";
};

export function LiveRttPanel({ className, tone = "default" }: Props) {
  const neo = tone === "landing";
  const t = useTranslations("Rtt");
  const pathname = usePathname();
  const locale = useLocale();
  const [asrLanguage, setAsrLanguage] = useState("vietnamese");
  const [running, setRunning] = useState(false);
  const [finalSegments, setFinalSegments] = useState<string[]>([]);
  const [currentPartial, setCurrentPartial] = useState("");
  const [status, setStatus] = useState(() => t("statusReady"));
  const [error, setError] = useState<string | null>(null);
  const [copyDone, setCopyDone] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [lastSavedId, setLastSavedId] = useState<string | null>(null);
  const [showLoginCta, setShowLoginCta] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [hasUserSession, setHasUserSession] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const sessionReadyRef = useRef(false);
  const intentionalCloseRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopAudio = useCallback(() => {
    sessionReadyRef.current = false;
    processorRef.current?.disconnect();
    processorRef.current = null;
    sourceRef.current?.disconnect();
    sourceRef.current = null;
    streamRef.current?.getTracks().forEach((tr) => tr.stop());
    streamRef.current = null;
    void audioContextRef.current?.close().catch(() => {});
    audioContextRef.current = null;
  }, []);

  const stopAll = useCallback(() => {
    stopAudio();
    const ws = wsRef.current;
    wsRef.current = null;
    if (ws && ws.readyState === WebSocket.OPEN) {
      intentionalCloseRef.current = true;
      try {
        ws.send(JSON.stringify({ type: "audio.commit" }));
      } catch {
        /* ignore */
      }
      try {
        ws.send(JSON.stringify({ type: "session.stop" }));
      } catch {
        /* ignore */
      }
      ws.close(1000, "client_stop");
    }
    setRunning(false);
    setStatus(t("statusStopped"));
  }, [stopAudio, t]);

  const appendFinal = useCallback((text: string) => {
    const seg = text.trim();
    if (!seg) return;
    setFinalSegments((prev) => [...prev, seg]);
  }, []);

  const buildTranscriptExport = useCallback(() => {
    const finals = finalSegments.join(" ").trim();
    const partial = currentPartial.trim();
    if (partial) {
      const banner = t("exportPartialBanner");
      return finals
        ? `${finals}\n\n${banner}\n${partial}`
        : `${banner}\n${partial}`;
    }
    return finals;
  }, [currentPartial, finalSegments, t]);

  const clearTranscript = useCallback(() => {
    setFinalSegments([]);
    setCurrentPartial("");
    setLastSavedId(null);
    setShowLoginCta(false);
  }, []);

  const saveNote = useCallback(async () => {
    const text = buildTranscriptExport();
    if (!text) return;
    setSaveLoading(true);
    setShowLoginCta(false);
    setError(null);
    try {
      const result = await saveTranscriptSession({ transcript: text });
      if (!result.ok && result.code === "AUTH_REQUIRED") {
        setHasUserSession(false);
        setError(t("saveSessionExpired"));
        setShowLoginCta(true);
        return;
      }
      if (result.ok) {
        setLastSavedId(result.id);
        setError(null);
      } else {
        setLastSavedId(null);
        setError(result.message ?? t("saveFailed"));
      }
    } catch {
      setError(t("saveFailed"));
    } finally {
      setSaveLoading(false);
    }
  }, [buildTranscriptExport, t]);

  useEffect(() => {
    let cancelled = false;
    let subscription: { unsubscribe: () => void } | undefined;

    try {
      const supabase = createSupabaseBrowserClient();
      void supabase.auth.getSession().then(({ data: { session } }) => {
        if (cancelled) return;
        setHasUserSession(!!session);
        setSessionChecked(true);
      });
      const sub = supabase.auth.onAuthStateChange((_event, session) => {
        setHasUserSession(!!session);
        setSessionChecked(true);
      });
      subscription = sub.data.subscription;
    } catch {
      queueMicrotask(() => {
        if (cancelled) return;
        setHasUserSession(false);
        setSessionChecked(true);
      });
    }

    return () => {
      cancelled = true;
      subscription?.unsubscribe();
    };
  }, []);

  const copyTranscript = useCallback(async () => {
    const text = buildTranscriptExport();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopyDone(true);
      window.setTimeout(() => setCopyDone(false), 2000);
      setError(null);
    } catch {
      setError(t("copyFailed"));
    }
  }, [buildTranscriptExport, t]);

  const downloadTranscript = useCallback(() => {
    const text = buildTranscriptExport();
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    a.href = url;
    a.download = `live-notes-${stamp}.txt`;
    a.rel = "noopener";
    a.click();
    URL.revokeObjectURL(url);
  }, [buildTranscriptExport]);

  const startAudioGraph = useCallback(
    async (ws: WebSocket) => {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(t("errNoGetUserMedia"));
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
        video: false,
      });
      streamRef.current = stream;

      const ctx = new AudioContext();
      audioContextRef.current = ctx;
      await ctx.resume();

      const source = ctx.createMediaStreamSource(stream);
      sourceRef.current = source;

      const processor = ctx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (ev) => {
        if (!sessionReadyRef.current || ws.readyState !== WebSocket.OPEN) {
          return;
        }
        const ch0 = ev.inputBuffer.getChannelData(0);
        const pcm = downsampleTo16kPcm16(ch0, ctx.sampleRate);
        if (!pcm.length) return;
        try {
          ws.send(
            JSON.stringify({
              type: "audio.append",
              audio: pcm16ToBase64(pcm),
            }),
          );
        } catch {
          /* ignore */
        }
      };

      const mute = ctx.createGain();
      mute.gain.value = 0;
      source.connect(processor);
      processor.connect(mute);
      mute.connect(ctx.destination);
      setStatus(t("statusRecording"));
    },
    [t],
  );

  const handleServerMessage = useCallback(
    async (raw: string, ws: WebSocket) => {
      let msg: RttServerMessage;
      try {
        msg = JSON.parse(raw) as RttServerMessage;
      } catch {
        return;
      }

      switch (msg.type) {
        case "session.created":
          setStatus(t("statusSessionCreated"));
          ws.send(
            JSON.stringify({
              type: "session.start",
              model: "valsea-rtt",
              language: asrLanguage,
              enable_correction: true,
              hint_text: "",
            }),
          );
          break;
        case "session.ready":
          setStatus(t("statusEngineReady"));
          sessionReadyRef.current = true;
          try {
            await startAudioGraph(ws);
          } catch (e) {
            setError(e instanceof Error ? e.message : t("errMicOpen"));
            stopAll();
          }
          break;
        case "transcript.partial":
          setCurrentPartial(msg.text ?? "");
          break;
        case "transcript.final":
          appendFinal(msg.text ?? "");
          setCurrentPartial("");
          break;
        case "error":
          setError(msg.message ?? msg.code ?? t("errValseaGeneric"));
          stopAll();
          break;
        default:
          break;
      }
    },
    [appendFinal, asrLanguage, startAudioGraph, stopAll, t],
  );

  const start = useCallback(() => {
    setError(null);
    setFinalSegments([]);
    setCurrentPartial("");
    setStatus(t("statusConnecting"));
    sessionReadyRef.current = false;
    intentionalCloseRef.current = false;

    const ws = new WebSocket(DEFAULT_PROXY_WS);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus(t("statusWsOpen"));
      setRunning(true);
    };

    ws.onmessage = (ev) => {
      void handleServerMessage(String(ev.data), ws);
    };

    ws.onerror = () => {
      setError(t("errWs"));
      stopAudio();
      wsRef.current = null;
      setRunning(false);
    };

    ws.onclose = () => {
      stopAudio();
      wsRef.current = null;
      setRunning(false);
      if (intentionalCloseRef.current) {
        intentionalCloseRef.current = false;
        return;
      }
      setStatus(t("statusDisconnected"));
    };
  }, [handleServerMessage, stopAudio, t]);

  useEffect(() => {
    return () => {
      stopAll();
    };
  }, [stopAll]);

  return (
    <div
      className={cn("grid gap-6 lg:grid-cols-2 lg:gap-8", className)}
      aria-live="polite"
    >
      <Card
        className={cn(
          "flex flex-col gap-4",
          neo && "neo-card border-0 shadow-none",
        )}
      >
        <div>
          <CardTitle
            className={cn(
              neo && "text-xl font-extrabold tracking-tight sm:text-2xl",
            )}
          >
            {t("cardTitle")}
          </CardTitle>
          <CardDescription className={cn(neo && "font-medium leading-relaxed")}>
            {t("cardIntro")}
          </CardDescription>
        </div>
        {error ? (
          <p
            className={cn(
              "rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300",
              neo &&
                "border-2 border-red-600/50 shadow-[3px_3px_0_0_color-mix(in_srgb,red_35%,var(--neo-raised))]",
            )}
          >
            {error}
          </p>
        ) : null}
        <div className="flex flex-col gap-1.5">
          <label
            className={cn(
              "text-xs font-medium text-[var(--muted-fg)]",
              neo &&
                "font-extrabold uppercase tracking-wide text-[var(--foreground)]",
            )}
            htmlFor="valsea-rtt-language"
          >
            {t("asrLanguage")}
          </label>
          <select
            id="valsea-rtt-language"
            className={cn(
              "max-w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-60",
              neo &&
                "rounded-xl border-2 border-[var(--neo-ink)] bg-[var(--surface)] font-medium shadow-[4px_4px_0_0_var(--neo-raised)]",
            )}
            value={asrLanguage}
            disabled={running}
            onChange={(e) => setAsrLanguage(e.target.value)}
          >
            {VALSEA_RTT_LANGUAGE_CODES.map((code) => (
              <option key={code} value={code}>
                {t(`lang.${code}`)}
              </option>
            ))}
          </select>
          <p className="text-xs text-[var(--muted-fg)]">
            {t("asrLanguageHint")}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {!running ? (
            <Button
              type="button"
              variant={neo ? "ghost" : "primary"}
              onClick={start}
              className={cn(
                neo &&
                  "neo-btn neo-btn--mint px-6 py-3 text-sm font-extrabold sm:px-8",
              )}
            >
              {t("start")}
            </Button>
          ) : (
            <Button
              type="button"
              variant={neo ? "ghost" : "secondary"}
              onClick={stopAll}
              className={cn(
                neo && "neo-btn neo-btn--sky px-6 py-3 text-sm font-extrabold",
              )}
            >
              {t("stop")}
            </Button>
          )}
        </div>
        <p
          className={cn(
            "text-xs text-[var(--muted-fg)]",
            neo && "font-medium text-[var(--foreground)]/90",
          )}
        >
          {status}
        </p>
      </Card>

      <Card
        className={cn(
          "flex min-h-[280px] flex-col gap-3",
          neo && "neo-card border-0 shadow-none",
        )}
      >
        <div>
          <CardTitle
            className={cn(
              neo && "text-xl font-extrabold tracking-tight sm:text-2xl",
            )}
          >
            {t("transcriptTitle")}
          </CardTitle>
          <CardDescription className={cn(neo && "font-medium leading-relaxed")}>
            {t("transcriptHint")}
          </CardDescription>
        </div>
        {finalSegments.length > 0 || currentPartial.trim() ? (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              className={cn(
                "px-3 py-2 text-xs",
                neo && "neo-btn neo-btn--ghost font-extrabold",
              )}
              aria-label={t("copyNotesAria")}
              onClick={() => void copyTranscript()}
            >
              {copyDone ? t("copyDone") : t("copyNotes")}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className={cn(
                "px-3 py-2 text-xs",
                neo && "neo-btn neo-btn--ghost font-extrabold",
              )}
              aria-label={t("downloadTxtAria")}
              onClick={downloadTranscript}
            >
              {t("downloadTxt")}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className={cn(
                "px-3 py-2 text-xs",
                neo && "neo-btn neo-btn--ghost font-extrabold",
              )}
              aria-label={t("clearNotesAria")}
              disabled={running}
              title={running ? t("clearWhileRecordingHint") : undefined}
              onClick={clearTranscript}
            >
              {t("clearNotes")}
            </Button>
            {!sessionChecked ? (
              <span
                className={cn(
                  "inline-flex items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--muted-fg)]",
                  neo &&
                    "border-2 border-[var(--neo-ink)] font-bold text-[var(--foreground)] shadow-[3px_3px_0_0_var(--neo-raised)]",
                )}
                aria-live="polite"
              >
                {t("saveAuthChecking")}
              </span>
            ) : hasUserSession ? (
              <Button
                type="button"
                variant={neo ? "ghost" : "secondary"}
                className={cn(
                  "px-3 py-2 text-xs",
                  neo && "neo-btn neo-btn--sky font-extrabold",
                )}
                aria-label={t("saveNoteAria")}
                disabled={running || saveLoading}
                onClick={() => void saveNote()}
              >
                {saveLoading ? t("saveSaving") : t("saveNote")}
              </Button>
            ) : (
              <Link
                href={`/login?next=${encodeURIComponent(localizedAppPath(pathname || "/live", locale))}`}
                className={cn(
                  buttonClassName(
                    "secondary",
                    "px-3 py-2 text-xs no-underline",
                  ),
                  neo && "neo-btn neo-btn--mint font-extrabold",
                )}
                aria-label={t("loginToSaveAria")}
              >
                {t("loginToSave")}
              </Link>
            )}
          </div>
        ) : null}
        {lastSavedId ? (
          <p
            className="text-xs text-emerald-700 dark:text-emerald-400"
            role="status"
          >
            {t("saveSuccess")}
          </p>
        ) : null}
        {showLoginCta ? (
          <p className="text-xs text-[var(--muted-fg)]">
            <Link
              className={cn(
                "font-bold underline decoration-2 underline-offset-2",
                neo &&
                  "text-[var(--landing-accent)] decoration-[var(--neo-ink)]",
              )}
              href="/login"
            >
              {t("saveLoginLink")}
            </Link>
          </p>
        ) : null}
        <div
          className={cn(
            "max-h-[420px] flex-1 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--muted)]/40 p-4 text-sm leading-relaxed",
            neo &&
              "border-2 border-[var(--neo-ink)] bg-[color-mix(in_srgb,var(--muted)_50%,var(--surface))] shadow-[4px_4px_0_0_var(--neo-raised)]",
          )}
          tabIndex={0}
        >
          {finalSegments.length === 0 && !currentPartial ? (
            <span className="text-[var(--muted-fg)]">{t("emptyHint")}</span>
          ) : (
            <div className="space-y-2 whitespace-pre-wrap">
              <p>{finalSegments.join(" ")}</p>
              {currentPartial ? (
                <p className="text-[var(--muted-fg)] italic">
                  {currentPartial}
                </p>
              ) : null}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
