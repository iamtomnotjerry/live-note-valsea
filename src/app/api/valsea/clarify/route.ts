import { NextResponse } from "next/server";
import { VALSEA_TEXT_MAX, valseaPostJson } from "@/lib/valsea-api";

type Body = {
  text?: unknown;
  language?: unknown;
};

export async function POST(request: Request) {
  let parsed: Body;
  try {
    parsed = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const text =
    typeof parsed.text === "string"
      ? parsed.text.trim().slice(0, VALSEA_TEXT_MAX)
      : "";
  if (!text) {
    return NextResponse.json(
      { error: "Missing or empty text." },
      { status: 400 },
    );
  }

  const language =
    typeof parsed.language === "string" && parsed.language.trim()
      ? parsed.language.trim().slice(0, 64)
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
      {
        error:
          r.status === 503
            ? "Clarify is not configured on the server."
            : r.message,
        detail: r.detail,
      },
      { status: r.status },
    );
  }

  const clarified = r.data?.clarified_text?.trim() ?? "";
  if (!clarified) {
    return NextResponse.json(
      { error: "No clarified text in response." },
      { status: 502 },
    );
  }

  return NextResponse.json({ clarified_text: clarified });
}
