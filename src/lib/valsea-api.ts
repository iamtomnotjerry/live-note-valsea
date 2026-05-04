/** Server-only VALSEA HTTP helpers (use from Route Handlers). */

export const VALSEA_TEXT_MAX = 120_000;

const BASE = "https://api.valsea.ai";

export function getValseaApiKey(): string | null {
  const k = process.env.VALSEA_API_KEY?.trim();
  return k || null;
}

export type ValseaUpstreamError = {
  ok: false;
  status: number;
  message: string;
  detail?: string;
};

export type ValseaUpstreamOk<T> = { ok: true; data: T };

export async function valseaPostJson<T = unknown>(
  path: string,
  body: Record<string, unknown>,
): Promise<ValseaUpstreamOk<T> | ValseaUpstreamError> {
  const key = getValseaApiKey();
  if (!key) {
    return { ok: false, status: 503, message: "Missing VALSEA_API_KEY." };
  }
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch {
    return {
      ok: false,
      status: 502,
      message: "Could not reach VALSEA.",
    };
  }
  const raw = await res.text();
  let data: unknown;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = null;
  }
  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      message: "VALSEA returned an error.",
      detail: typeof raw === "string" ? raw.slice(0, 1200) : undefined,
    };
  }
  return { ok: true, data: data as T };
}

export async function valseaPostMultipart(
  path: string,
  form: FormData,
): Promise<ValseaUpstreamOk<unknown> | ValseaUpstreamError> {
  const key = getValseaApiKey();
  if (!key) {
    return { ok: false, status: 503, message: "Missing VALSEA_API_KEY." };
  }
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}` },
      body: form,
    });
  } catch {
    return {
      ok: false,
      status: 502,
      message: "Could not reach VALSEA.",
    };
  }
  const raw = await res.text();
  let data: unknown;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = null;
  }
  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      message: "VALSEA returned an error.",
      detail: typeof raw === "string" ? raw.slice(0, 1200) : undefined,
    };
  }
  return { ok: true, data };
}

export function parseFormatOutput(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const o = data as Record<string, unknown>;
  const ordered = [
    "formatted_text",
    "formatted_output",
    "formatted_transcript",
    "output_text",
    "output",
    "result",
    "text",
    "content",
  ];
  for (const k of ordered) {
    const v = o[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  const choices = o.choices;
  if (Array.isArray(choices) && choices[0] && typeof choices[0] === "object") {
    const msg = (choices[0] as { message?: { content?: unknown } }).message;
    if (msg && typeof msg.content === "string" && msg.content.trim()) {
      return msg.content.trim();
    }
  }
  let best = "";
  const skip = new Set([
    "model",
    "object",
    "usage",
    "id",
    "created",
    "sentiment",
    "confidence",
  ]);
  for (const [k, v] of Object.entries(o)) {
    if (skip.has(k)) continue;
    if (typeof v === "string" && v.length > best.length) best = v;
  }
  return best.trim() || null;
}
