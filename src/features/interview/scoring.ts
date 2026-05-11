import type { InterviewQuestion } from "@/features/interview/question-bank";

export type ScoreBreakdown = {
  clarity: number;
  relevance: number;
  structure: number;
  communication: number;
  overall: number;
};

export type QuestionEvaluation = {
  score: ScoreBreakdown;
  strengths: string[];
  improvements: string[];
};

export type EvaluatedAnswer = {
  questionId: string;
  questionPrompt: string;
  topic: string;
  rawAnswer: string;
  clarifiedAnswer: string;
  interviewNotes: string;
  actionItems: string;
  sentiment: string;
  confidence: number | null;
  reasoning: string;
  evaluation: QuestionEvaluation;
};

function clamp0to100(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function safeSplitWords(text: string): string[] {
  return text.trim().toLowerCase().split(/\s+/).filter(Boolean);
}

function scoreClarity(text: string): number {
  const words = safeSplitWords(text);
  const count = words.length;
  if (count < 20) return 55;
  if (count < 45) return 70;
  if (count < 90) return 82;
  return 74;
}

function scoreStructure(text: string): number {
  const lower = text.toLowerCase();
  const hasSituation =
    lower.includes("situation") ||
    lower.includes("context") ||
    lower.includes("background");
  const hasTask =
    lower.includes("task") ||
    lower.includes("goal") ||
    lower.includes("objective");
  const hasAction =
    lower.includes("i did") ||
    lower.includes("we implemented") ||
    lower.includes("action") ||
    lower.includes("approach");
  const hasResult =
    lower.includes("result") ||
    lower.includes("outcome") ||
    lower.includes("impact") ||
    lower.includes("%");
  const points = [hasSituation, hasTask, hasAction, hasResult].filter(
    Boolean,
  ).length;
  return 52 + points * 12;
}

function scoreCommunication(text: string): number {
  const punctuationMatches = text.match(/[.!?]/g);
  const sentenceCount = punctuationMatches ? punctuationMatches.length : 1;
  const words = safeSplitWords(text).length;
  const avgWordsPerSentence = words / Math.max(sentenceCount, 1);
  if (avgWordsPerSentence > 28) return 66;
  if (avgWordsPerSentence > 20) return 74;
  if (avgWordsPerSentence > 10) return 84;
  return 72;
}

function scoreKoreanWorkstyle(answer: string): number {
  const lower = answer.toLowerCase();
  const indicators = [
    "ownership",
    "responsibility",
    "daily update",
    "status update",
    "blocker",
    "eta",
    "alignment",
    "stakeholder",
    "follow up",
    "report",
    "respect",
    "team",
    "deadline",
    "risk",
  ];
  const hits = indicators.reduce(
    (acc, token) => acc + (lower.includes(token) ? 1 : 0),
    0,
  );
  if (hits <= 1) return 58;
  if (hits <= 3) return 70;
  if (hits <= 5) return 80;
  return 88;
}

function scoreRelevance(answer: string, question: InterviewQuestion): number {
  const answerWords = new Set(safeSplitWords(answer));
  const topicWords = safeSplitWords(`${question.topic} ${question.prompt}`)
    .filter((w) => w.length >= 4)
    .slice(0, 12);
  if (topicWords.length === 0) return 72;
  let hits = 0;
  for (const token of topicWords) {
    if (answerWords.has(token)) hits += 1;
  }
  const ratio = hits / topicWords.length;
  return 58 + ratio * 40;
}

export function evaluateAnswer(
  answer: string,
  question: InterviewQuestion,
): QuestionEvaluation {
  const clarity = clamp0to100(scoreClarity(answer));
  const relevance = clamp0to100(scoreRelevance(answer, question));
  const structure = clamp0to100(scoreStructure(answer));
  const communication = clamp0to100(scoreCommunication(answer));
  const koreanWorkstyle = clamp0to100(scoreKoreanWorkstyle(answer));
  const adjustedRelevance = clamp0to100(
    relevance * 0.8 + koreanWorkstyle * 0.2,
  );
  const adjustedCommunication = clamp0to100(
    communication * 0.85 + koreanWorkstyle * 0.15,
  );
  const overall = clamp0to100(
    clarity * 0.25 +
      adjustedRelevance * 0.35 +
      structure * 0.25 +
      adjustedCommunication * 0.15,
  );

  const strengths: string[] = [];
  const improvements: string[] = [];

  if (adjustedRelevance >= 78)
    strengths.push("Your answer stays focused on the interview question.");
  if (structure >= 78)
    strengths.push("You show a clear problem-to-action-to-result flow.");
  if (adjustedCommunication >= 78)
    strengths.push("Your explanation is easy to follow and concise.");
  if (koreanWorkstyle >= 78) {
    strengths.push(
      "You demonstrate Korean-friendly workstyle signals: ownership, clear updates, and accountability.",
    );
  }

  if (strengths.length === 0) {
    strengths.push(
      "You provided enough context to start a meaningful evaluation.",
    );
  }

  if (structure < 72) {
    improvements.push(
      "Use STAR structure more explicitly: Situation, Task, Action, Result.",
    );
  }
  if (adjustedRelevance < 72) {
    improvements.push(
      "Anchor the answer tighter to the question keywords and expected outcome.",
    );
  }
  if (clarity < 72) {
    improvements.push(
      "Reduce filler and keep each sentence focused on one point.",
    );
  }
  if (koreanWorkstyle < 72) {
    improvements.push(
      "Add Korean interview expectations: clear ownership, blocker reporting, and commitment with ETA.",
    );
  }
  if (improvements.length === 0) {
    improvements.push(
      "Add one quantified outcome to make your impact more convincing.",
    );
  }

  return {
    score: {
      clarity,
      relevance: adjustedRelevance,
      structure,
      communication: adjustedCommunication,
      overall,
    },
    strengths,
    improvements,
  };
}

export function aggregateSessionScore(
  items: EvaluatedAnswer[],
): ScoreBreakdown {
  if (items.length === 0) {
    return {
      clarity: 0,
      relevance: 0,
      structure: 0,
      communication: 0,
      overall: 0,
    };
  }

  const total = items.reduce(
    (acc, item) => {
      acc.clarity += item.evaluation.score.clarity;
      acc.relevance += item.evaluation.score.relevance;
      acc.structure += item.evaluation.score.structure;
      acc.communication += item.evaluation.score.communication;
      acc.overall += item.evaluation.score.overall;
      return acc;
    },
    { clarity: 0, relevance: 0, structure: 0, communication: 0, overall: 0 },
  );
  const n = items.length;
  return {
    clarity: clamp0to100(total.clarity / n),
    relevance: clamp0to100(total.relevance / n),
    structure: clamp0to100(total.structure / n),
    communication: clamp0to100(total.communication / n),
    overall: clamp0to100(total.overall / n),
  };
}

export function buildSessionReport(args: {
  trackLabel: string;
  levelLabel: string;
  languageLabel: string;
  score: ScoreBreakdown;
  entries: EvaluatedAnswer[];
}): string {
  const lines: string[] = [];
  lines.push("# Interview Prep Coach Report");
  lines.push("");
  lines.push(`Track: ${args.trackLabel}`);
  lines.push(`Level: ${args.levelLabel}`);
  lines.push(`Language: ${args.languageLabel}`);
  lines.push("");
  lines.push("## Overall score");
  lines.push(`- Overall: ${args.score.overall}/100`);
  lines.push(`- Clarity: ${args.score.clarity}/100`);
  lines.push(`- Relevance: ${args.score.relevance}/100`);
  lines.push(`- Structure (STAR): ${args.score.structure}/100`);
  lines.push(`- Communication: ${args.score.communication}/100`);
  lines.push("");

  args.entries.forEach((entry, index) => {
    lines.push(`## Question ${index + 1}: ${entry.questionPrompt}`);
    lines.push(`Topic: ${entry.topic}`);
    lines.push(`Score: ${entry.evaluation.score.overall}/100`);
    lines.push("");
    lines.push("Raw answer:");
    lines.push(entry.rawAnswer || "(empty)");
    lines.push("");
    lines.push("AI clarified answer:");
    lines.push(entry.clarifiedAnswer || "(no output)");
    lines.push("");
    lines.push("AI interview notes:");
    lines.push(entry.interviewNotes || "(no output)");
    lines.push("");
    lines.push("AI action items:");
    lines.push(entry.actionItems || "(no output)");
    lines.push("");
    lines.push("Strengths:");
    for (const item of entry.evaluation.strengths) lines.push(`- ${item}`);
    lines.push("Improvements:");
    for (const item of entry.evaluation.improvements) lines.push(`- ${item}`);
    lines.push("");
  });

  return `${lines.join("\n").trim()}\n`;
}
