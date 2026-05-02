"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { downsampleTo16kPcm16, pcm16ToBase64 } from "@/features/live-note/pcm";

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
  language?: string;
};

export function LiveRttPanel({ className, language = "vietnamese" }: Props) {
  const [running, setRunning] = useState(false);
  const [finalSegments, setFinalSegments] = useState<string[]>([]);
  const [currentPartial, setCurrentPartial] = useState("");
  const [status, setStatus] = useState<string>("Sẵn sàng.");
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const sessionReadyRef = useRef(false);
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
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    void audioContextRef.current?.close().catch(() => {});
    audioContextRef.current = null;
  }, []);

  const stopAll = useCallback(() => {
    stopAudio();
    const ws = wsRef.current;
    wsRef.current = null;
    if (ws && ws.readyState === WebSocket.OPEN) {
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
    setStatus("Đã dừng.");
  }, [stopAudio]);

  const appendFinal = useCallback((text: string) => {
    const t = text.trim();
    if (!t) return;
    setFinalSegments((prev) => [...prev, t]);
  }, []);

  const startAudioGraph = useCallback(async (ws: WebSocket) => {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("Trình duyệt không hỗ trợ getUserMedia.");
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
    setStatus("Đang thu âm → VALSEA RTT.");
  }, []);

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
          setStatus("Đã tạo phiên. Gửi session.start…");
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
          setStatus("Engine sẵn sàng. Bật micro…");
          sessionReadyRef.current = true;
          try {
            await startAudioGraph(ws);
          } catch (e) {
            setError(e instanceof Error ? e.message : "Không mở được micro.");
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
          setError(msg.message ?? msg.code ?? "Lỗi VALSEA RTT");
          stopAll();
          break;
        default:
          break;
      }
    },
    [appendFinal, language, startAudioGraph, stopAll],
  );

  const start = useCallback(() => {
    setError(null);
    setFinalSegments([]);
    setCurrentPartial("");
    setStatus("Đang kết nối WebSocket…");
    sessionReadyRef.current = false;

    const ws = new WebSocket(DEFAULT_PROXY_WS);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("WebSocket mở. Chờ session.created…");
      setRunning(true);
    };

    ws.onmessage = (ev) => {
      void handleServerMessage(String(ev.data), ws);
    };

    ws.onerror = () => {
      setError(
        `Lỗi WebSocket tới ${DEFAULT_PROXY_WS}. Chạy "npm run dev:rtt" và kiểm tra VALSEA_API_KEY trong .env.local.`,
      );
      stopAudio();
      wsRef.current = null;
      setRunning(false);
    };

    ws.onclose = () => {
      stopAudio();
      wsRef.current = null;
      setRunning(false);
      setStatus((s) => (s.startsWith("Đã dừng") ? s : "Mất kết nối."));
    };
  }, [handleServerMessage, stopAudio]);

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
          <CardTitle>VALSEA RTT (WebSocket)</CardTitle>
          <CardDescription>
            Trình duyệt nối tới proxy cục bộ{" "}
            <code className="rounded bg-[var(--muted)] px-1 font-mono text-xs">
              {DEFAULT_PROXY_WS}
            </code>
            ; proxy gắn Bearer tới{" "}
            <code className="font-mono text-xs">
              wss://api.valsea.ai/v1/realtime
            </code>
            . PCM 16 kHz mono theo tài liệu VALSEA.
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
              Start recording
            </Button>
          ) : (
            <Button type="button" variant="secondary" onClick={stopAll}>
              Stop
            </Button>
          )}
        </div>
        <p className="text-xs text-[var(--muted-fg)]">{status}</p>
      </Card>

      <Card className="flex min-h-[280px] flex-col gap-3">
        <div>
          <CardTitle>Live transcript</CardTitle>
          <CardDescription>
            Partial thay đổi theo thời gian; chỉ final được ghép vào lịch sử
            (theo khuyến nghị VALSEA).
          </CardDescription>
        </div>
        <div
          className="max-h-[420px] flex-1 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--muted)]/40 p-4 text-sm leading-relaxed"
          tabIndex={0}
        >
          {finalSegments.length === 0 && !currentPartial ? (
            <span className="text-[var(--muted-fg)]">
              Chưa có nội dung. Chạy{" "}
              <code className="font-mono text-xs">npm run dev:rtt</code>, bấm
              Start, nói vào micro.
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
