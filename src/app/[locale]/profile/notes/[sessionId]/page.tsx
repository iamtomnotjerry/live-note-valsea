import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { listNoteFolders } from "@/features/live-note/note-folder-actions";
import { NoteEditorForm } from "@/features/profile/note-editor-form";
import { getTranscriptSessionForEditor } from "@/features/profile/transcript-session-actions";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ sessionId: string }> };

export async function generateMetadata({ params }: Props) {
  const { sessionId } = await params;
  const session = await getTranscriptSessionForEditor(sessionId);
  const t = await getTranslations("Profile");
  if (!session) {
    return { title: t("noteNotFoundTitle") };
  }
  const title = (session.title?.trim() || t("noteUntitled")).slice(0, 80);
  return {
    title,
    description: t("editorMetaDescription"),
  };
}

export default async function ProfileNoteEditorPage({ params }: Props) {
  const { sessionId } = await params;
  const session = await getTranscriptSessionForEditor(sessionId);
  if (!session) notFound();

  const foldersResult = await listNoteFolders();
  const folders = foldersResult.ok ? foldersResult.folders : [];

  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-8",
        "border-2 border-[var(--neo-ink)] shadow-[6px_6px_0_0_var(--neo-raised)]",
      )}
    >
      <NoteEditorForm
        session={session}
        initialFolders={folders}
        tone="landing"
      />
    </div>
  );
}
