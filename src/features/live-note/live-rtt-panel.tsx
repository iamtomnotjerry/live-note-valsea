"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { downsampleTo16kPcm16, pcm16ToBase64 } from "@/features/live-note/pcm";

const DEFAULT_PROXY_WS =
  process.env.NEXT_PUBLIC_VALSEA_RT_PROXY_URL ?? "ws://127.0.0.1:3331";

const REALTIME_URL = "wss://api.valsea.ai/v1/realtime";

type RttServerMessage = {
  type: string;
  text?: string;
  message?: string;
  code?: string;
};

type Props = {
  className?: string;
  language?: string;
};

export function LiveRttPanel({ className, language = "vietnamese" }: Props) {
  const t = useTranslations("Rtt");
  const [running, setRunning] = useState(false);
  const [finalSegments, setFinalSegments] = useState<string[]>([]);
  const [currentPartial, setCurrentPartial] = useState("");
  const [status, setStatus] = useState(() => t("statusReady"));
  const [error, setError] = useState<string | null>(null);

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
              language,
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
    [appendFinal, language, startAudioGraph, stopAll, t],
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
      setError(t("errWs", { url: DEFAULT_PROXY_WS }));
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
      <Card className="flex flex-col gap-4">
        <div>
          <CardTitle>{t("cardTitle")}</CardTitle>
          <CardDescription>
            {t("cardDescBefore")}{" "}
            <code className="rounded bg-[var(--muted)] px-1 font-mono text-xs break-all">
              {DEFAULT_PROXY_WS}
            </code>{" "}
            {t("cardDescMid")}{" "}
            <code className="font-mono text-xs break-all">{REALTIME_URL}</code>
            {t("cardDescAfter")}
          </CardDescription>
        </div>
        {error ? (
          <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300">
            {error}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-3">
          {!running ? (
            <Button type="button" onClick={start}>
              {t("start")}
            </Button>
          ) : (
            <Button type="button" variant="secondary" onClick={stopAll}>
              {t("stop")}
            </Button>
          )}
        </div>
        <p className="text-xs text-[var(--muted-fg)]">{status}</p>
      </Card>

      <Card className="flex min-h-[280px] flex-col gap-3">
        <div>
          <CardTitle>{t("transcriptTitle")}</CardTitle>
          <CardDescription>{t("transcriptHint")}</CardDescription>
        </div>
        <div
          className="max-h-[420px] flex-1 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--muted)]/40 p-4 text-sm leading-relaxed"
          tabIndex={0}
        >
          {finalSegments.length === 0 && !currentPartial ? (
            <span className="text-[var(--muted-fg)]">
              {t("emptyHintBefore")}{" "}
              <code className="font-mono text-xs">npm run dev:rtt</code>{" "}
              {t("emptyHintAfter")}
            </span>
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
