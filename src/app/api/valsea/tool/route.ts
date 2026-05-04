import { NextResponse } from "next/server";
import {
  parseFormatOutput,
  VALSEA_TEXT_MAX,
  valseaPostJson,
} from "@/lib/valsea-api";

const FORMAT_OUTPUT_TYPES = new Set([
  "meeting_minutes",
  "sales_summary",
  "service_log",
  "subtitles",
  "email_summary",
  "action_items",
  "key_quotes",
  "interview_notes",
]);

type ToolBody = {
  tool?: unknown;
  text?: unknown;
  transcript?: unknown;
  language?: unknown;
  source?: unknown;
  target?: unknown;
  annotated_text?: unknown;
  output_type?: unknown;
  enable_correction?: unknown;
  enable_tags?: unknown;
};

function sliceText(raw: unknown): string {
  if (typeof raw !== "string") return "";
  return raw.trim().slice(0, VALSEA_TEXT_MAX);
}

export async function POST(request: Request) {
  let body: ToolBody;
  try {
    body = (await request.json()) as ToolBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const tool = typeof body.tool === "string" ? body.tool.trim() : "";

  if (tool === "clarify") {
    const text = sliceText(body.text);
    if (!text) {
      return NextResponse.json({ error: "Missing text." }, { status: 400 });
    }
    const language =
      typeof body.language === "string" && body.language.trim()
        ? body.language.trim().slice(0, 64)
        : undefined;
    const payload: Record<string, string> = {
      model: "valsea-clarify",
      text,
    };
    if (language) payload.language = language;
    const r = await valseaPostJson<{ clarified_text?: string }>(
      "/v1/clarifications",
      payload,
    );
    if (!r.ok) {
      return NextResponse.json(
        { error: r.message, detail: r.detail },
        { status: r.status },
      );
    }
    const out = r.data?.clarified_text?.trim();
    if (!out) {
      return NextResponse.json(
        { error: "No clarified_text in response." },
        { status: 502 },
      );
    }
    return NextResponse.json({ clarified_text: out });
  }

  if (tool === "translate") {
    const text = sliceText(body.text);
    const target =
      typeof body.target === "string" ? body.target.trim().slice(0, 64) : "";
    if (!text || !target) {
      return NextResponse.json(
        { error: "Missing text or target." },
        { status: 400 },
      );
    }
    const source =
      typeof body.source === "string" && body.source.trim()
        ? body.source.trim().slice(0, 64)
        : "auto";
    const r = await valseaPostJson<{ translated_text?: string }>(
      "/v1/translations",
      {
        model: "valsea-translate",
        text,
        target,
        source,
      },
    );
    if (!r.ok) {
      return NextResponse.json(
        { error: r.message, detail: r.detail },
        { status: r.status },
      );
    }
    const out = r.data?.translated_text?.trim();
    if (!out) {
      return NextResponse.json(
        { error: "No translated_text in response." },
        { status: 502 },
      );
    }
    return NextResponse.json({ translated_text: out });
  }

  if (tool === "annotate") {
    const text = sliceText(body.text);
    if (!text) {
      return NextResponse.json({ error: "Missing text." }, { status: 400 });
    }
    const language =
      typeof body.language === "string" && body.language.trim()
        ? body.language.trim().slice(0, 64)
        : undefined;
    const payload: Record<string, unknown> = {
      model: "valsea-annotate",
      text,
    };
    if (language) payload.language = language;
    if (typeof body.enable_correction === "boolean") {
      payload.enable_correction = body.enable_correction;
    }
    if (typeof body.enable_tags === "boolean") {
      payload.enable_tags = body.enable_tags;
    }
    const r = await valseaPostJson<{
      text?: string;
      annotated_text?: string;
    }>("/v1/annotations", payload);
    if (!r.ok) {
      return NextResponse.json(
        { error: r.message, detail: r.detail },
        { status: r.status },
      );
    }
    const d = r.data;
    const out =
      (typeof d?.annotated_text === "string" && d.annotated_text.trim()) ||
      (typeof d?.text === "string" && d.text.trim()) ||
      "";
    if (!out) {
      return NextResponse.json(
        { error: "No text in annotation response." },
        { status: 502 },
      );
    }
    return NextResponse.json({ text: out });
  }

  if (tool === "convert") {
    const annotated_text = sliceText(body.annotated_text ?? body.text);
    if (!annotated_text) {
      return NextResponse.json(
        { error: "Missing annotated_text." },
        { status: 400 },
      );
    }
    const r = await valseaPostJson<{ converted_text?: string }>(
      "/v1/conversions",
      {
        model: "valsea-convert",
        annotated_text,
      },
    );
    if (!r.ok) {
      return NextResponse.json(
        { error: r.message, detail: r.detail },
        { status: r.status },
      );
    }
    const out = r.data?.converted_text?.trim();
    if (!out) {
      return NextResponse.json(
        { error: "No converted_text in response." },
        { status: 502 },
      );
    }
    return NextResponse.json({ converted_text: out });
  }

  if (tool === "format") {
    const transcript = sliceText(body.transcript ?? body.text);
    const output_type =
      typeof body.output_type === "string" ? body.output_type.trim() : "";
    if (!transcript || !FORMAT_OUTPUT_TYPES.has(output_type)) {
      return NextResponse.json(
        { error: "Missing transcript or invalid output_type." },
        { status: 400 },
      );
    }
    const r = await valseaPostJson("/v1/formatting", {
      model: "valsea-format",
      transcript,
      output_type,
    });
    if (!r.ok) {
      return NextResponse.json(
        { error: r.message, detail: r.detail },
        { status: r.status },
      );
    }
    const formatted = parseFormatOutput(r.data);
    if (!formatted) {
      return NextResponse.json(
        { error: "Could not read formatted output from VALSEA." },
        { status: 502 },
      );
    }
    return NextResponse.json({ formatted_text: formatted });
  }

  if (tool === "sentiment") {
    const transcript = sliceText(body.transcript ?? body.text);
    if (!transcript) {
      return NextResponse.json(
        { error: "Missing transcript." },
        { status: 400 },
      );
    }
    const r = await valseaPostJson<{
      sentiment?: string;
      confidence?: number;
      reasoning?: string;
      emotions?: unknown;
    }>("/v1/sentiment", {
      model: "valsea-sentiment",
      transcript,
    });
    if (!r.ok) {
      return NextResponse.json(
        { error: r.message, detail: r.detail },
        { status: r.status },
      );
    }
    const d = r.data;
    return NextResponse.json({
      sentiment: typeof d?.sentiment === "string" ? d.sentiment : "unknown",
      confidence: typeof d?.confidence === "number" ? d.confidence : null,
      reasoning: typeof d?.reasoning === "string" ? d.reasoning : undefined,
      emotions: d?.emotions,
    });
  }

  return NextResponse.json({ error: "Unknown tool." }, { status: 400 });
}
