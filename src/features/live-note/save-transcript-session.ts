"use server";

import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const saveInputSchema = z.object({
  transcript: z.string().min(1).max(500_000),
  title: z.string().max(200).optional(),
});

export type SaveTranscriptSessionResult =
  | { ok: true; id: string }
  | {
      ok: false;
      code: "AUTH_REQUIRED" | "VALIDATION" | "DB";
      message?: string;
    };

function deriveTitle(transcript: string, explicit?: string): string {
  const t = explicit?.trim();
  if (t) return t.slice(0, 200);
  const line = transcript.trim().split(/\n/)[0] ?? "";
  const words = line.split(/\s+/).filter(Boolean).slice(0, 10).join(" ");
  return (words || "Live note").slice(0, 200);
}

export async function saveTranscriptSession(
  input: z.infer<typeof saveInputSchema>,
): Promise<SaveTranscriptSessionResult> {
  const parsed = saveInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      code: "VALIDATION",
      message: parsed.error.issues.map((i) => i.message).join("; "),
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, code: "AUTH_REQUIRED" };
  }

  const title = deriveTitle(parsed.data.transcript, parsed.data.title);

  const { data, error } = await supabase
    .from("transcript_sessions")
    .insert({
      user_id: user.id,
      title,
      transcript: parsed.data.transcript,
    })
    .select("id")
    .maybeSingle();

  if (error) {
    return { ok: false, code: "DB", message: error.message };
  }
  if (!data?.id) {
    return { ok: false, code: "DB", message: "No row returned" };
  }

  return { ok: true, id: data.id };
}
