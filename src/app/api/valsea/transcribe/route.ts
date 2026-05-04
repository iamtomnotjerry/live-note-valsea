import { NextResponse } from "next/server";
import { valseaPostMultipart } from "@/lib/valsea-api";

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Expected multipart form." },
      { status: 400 },
    );
  }

  const file = form.get("file");
  if (!(file instanceof Blob) || file.size === 0) {
    return NextResponse.json({ error: "Missing audio file." }, { status: 400 });
  }

  const languageRaw = form.get("language");
  const language =
    typeof languageRaw === "string" && languageRaw.trim()
      ? languageRaw.trim().slice(0, 64)
      : "english";

  const upstream = new FormData();
  upstream.append("file", file);
  upstream.append("model", "valsea-transcribe");
  upstream.append("language", language);
  upstream.append("response_format", "json");

  const r = await valseaPostMultipart("/v1/audio/transcriptions", upstream);
  if (!r.ok) {
    return NextResponse.json(
      { error: r.message, detail: r.detail },
      { status: r.status },
    );
  }
  const data = r.data as { text?: string } | null;
  const text = typeof data?.text === "string" ? data.text.trim() : "";
  if (!text) {
    return NextResponse.json(
      { error: "No text in transcription response." },
      { status: 502 },
    );
  }
  return NextResponse.json({ text });
}
