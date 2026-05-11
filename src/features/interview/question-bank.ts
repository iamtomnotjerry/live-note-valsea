export type InterviewTrack =
  | "software_engineer"
  | "business_analyst"
  | "qa_tester";

export type InterviewLevel = "intern" | "junior" | "mid" | "senior";

export type InterviewQuestion = {
  id: string;
  topic: string;
  prompt: string;
  followUpHint: string;
};

type TrackQuestionSet = Record<InterviewLevel, InterviewQuestion[]>;

const SOFTWARE_ENGINEER_QUESTIONS: TrackQuestionSet = {
  intern: [
    {
      id: "se-intro-intern",
      topic: "Self-introduction",
      prompt:
        "Please introduce yourself and one project you are most proud of.",
      followUpHint:
        "Use a short structure: context, your task, your concrete contribution, result.",
    },
    {
      id: "se-debug-intern",
      topic: "Debugging",
      prompt:
        "Tell me about a bug you fixed recently and how you found the root cause.",
      followUpHint: "Focus on steps, tools, and what you learned.",
    },
    {
      id: "se-team-intern",
      topic: "Collaboration",
      prompt: "How do you ask for help when you are blocked in a remote team?",
      followUpHint:
        "Mention communication channels, timing, and preparation before asking.",
    },
    {
      id: "se-learning-intern",
      topic: "Growth mindset",
      prompt:
        "What technology are you learning now, and why is it relevant to this role?",
      followUpHint: "Connect learning goals to business value.",
    },
    {
      id: "se-culture-intern",
      topic: "Korean workstyle",
      prompt:
        "How would you adapt to a Korean company that values clear daily updates?",
      followUpHint:
        "Mention ownership, concise status updates, and predictable follow-through.",
    },
  ],
  junior: [
    {
      id: "se-intro-junior",
      topic: "Self-introduction",
      prompt:
        "Give a one-minute introduction focused on your strongest engineering value.",
      followUpHint:
        "Keep it concise and tie your value to measurable outcomes.",
    },
    {
      id: "se-feature-junior",
      topic: "Feature delivery",
      prompt:
        "Describe a feature you shipped end-to-end and your role in quality.",
      followUpHint:
        "Include requirements, implementation, testing, and release.",
    },
    {
      id: "se-quality-junior",
      topic: "Quality mindset",
      prompt: "How do you prevent regressions when moving quickly?",
      followUpHint: "Talk about testing strategy and communication with QA/PM.",
    },
    {
      id: "se-incidents-junior",
      topic: "Production ownership",
      prompt:
        "Tell me about a production issue and how you handled user impact.",
      followUpHint:
        "Prioritize impact, containment, root cause, and prevention.",
    },
    {
      id: "se-culture-junior",
      topic: "Cross-cultural communication",
      prompt:
        "How do you communicate technical risks to non-native English stakeholders?",
      followUpHint:
        "Use simple language, clear assumptions, and explicit next actions.",
    },
  ],
  mid: [
    {
      id: "se-intro-mid",
      topic: "Career narrative",
      prompt:
        "Walk me through your career story and how it prepared you for this role.",
      followUpHint: "Highlight progression in ownership and decision quality.",
    },
    {
      id: "se-architecture-mid",
      topic: "System design basics",
      prompt:
        "How would you design a scalable module for live interview transcription feedback?",
      followUpHint: "Discuss data flow, bottlenecks, and trade-offs.",
    },
    {
      id: "se-priority-mid",
      topic: "Execution under constraints",
      prompt:
        "You have one week to deliver MVP quality. How do you prioritize scope?",
      followUpHint: "Explain criteria for must-have vs nice-to-have.",
    },
    {
      id: "se-coaching-mid",
      topic: "Team contribution",
      prompt:
        "How do you mentor juniors while keeping your own delivery on track?",
      followUpHint: "Show practical routines, not abstract principles only.",
    },
    {
      id: "se-korean-mid",
      topic: "Korean partner collaboration",
      prompt:
        "How would you report blockers to a Korean manager who expects structured updates?",
      followUpHint: "Use concise status format: issue, impact, action, ETA.",
    },
  ],
  senior: [
    {
      id: "se-vision-senior",
      topic: "Leadership",
      prompt:
        "How do you align engineering decisions with product and business outcomes?",
      followUpHint: "Describe a real decision with conflicting constraints.",
    },
    {
      id: "se-incident-senior",
      topic: "Incident management",
      prompt:
        "Explain your approach to handling a high-severity production outage.",
      followUpHint: "Cover communication, delegation, and postmortem quality.",
    },
    {
      id: "se-org-senior",
      topic: "Cross-team influence",
      prompt:
        "Tell me about influencing another team without direct authority.",
      followUpHint: "Clarify stakeholder mapping and how you built trust.",
    },
    {
      id: "se-hiring-senior",
      topic: "Talent development",
      prompt: "What do you look for when mentoring or interviewing engineers?",
      followUpHint: "Balance technical excellence with collaboration behavior.",
    },
    {
      id: "se-culture-senior",
      topic: "Global team culture",
      prompt:
        "How would you build predictable delivery in a Vietnam-Korea remote team?",
      followUpHint: "Mention rituals, transparency, and expectation alignment.",
    },
  ],
};

const BA_QUESTIONS: TrackQuestionSet = {
  intern: [
    {
      id: "ba-intro-intern",
      topic: "Self-introduction",
      prompt:
        "Introduce yourself and explain why you want to become a Business Analyst.",
      followUpHint: "Show motivation and evidence from projects or coursework.",
    },
    {
      id: "ba-req-intern",
      topic: "Requirements basics",
      prompt:
        "How would you capture requirements from a stakeholder with unclear expectations?",
      followUpHint: "Mention clarifying questions and confirmation methods.",
    },
    {
      id: "ba-priority-intern",
      topic: "Prioritization",
      prompt:
        "When timelines are short, how do you decide what must be delivered first?",
      followUpHint: "Use business value and user impact criteria.",
    },
  ],
  junior: [
    {
      id: "ba-story-junior",
      topic: "User stories",
      prompt:
        "How do you write a high-quality user story with acceptance criteria?",
      followUpHint: "Give a concrete example format.",
    },
    {
      id: "ba-conflict-junior",
      topic: "Stakeholder alignment",
      prompt: "How do you handle conflicting requests from two stakeholders?",
      followUpHint: "Explain negotiation and decision framework.",
    },
    {
      id: "ba-change-junior",
      topic: "Change management",
      prompt: "A requirement changed late in sprint. What would you do?",
      followUpHint: "Cover impact assessment and communication.",
    },
  ],
  mid: [
    {
      id: "ba-impact-mid",
      topic: "Business impact",
      prompt:
        "How do you connect requirements to measurable business outcomes?",
      followUpHint: "Name metrics and review cadence.",
    },
    {
      id: "ba-process-mid",
      topic: "Process optimization",
      prompt: "Describe a process you improved and how you proved improvement.",
      followUpHint: "Use before vs after evidence.",
    },
    {
      id: "ba-global-mid",
      topic: "Cross-cultural collaboration",
      prompt:
        "How would you run requirement workshops with a Vietnam-Korea team?",
      followUpHint: "Show facilitation structure and language clarity.",
    },
  ],
  senior: [
    {
      id: "ba-strategy-senior",
      topic: "Strategic analysis",
      prompt:
        "How do you balance short-term delivery and long-term process quality?",
      followUpHint: "Discuss roadmap framing and governance.",
    },
    {
      id: "ba-risk-senior",
      topic: "Risk management",
      prompt: "How do you identify and communicate project risks early?",
      followUpHint: "Include probability, impact, and mitigation ownership.",
    },
    {
      id: "ba-lead-senior",
      topic: "Leadership",
      prompt: "How do you coach junior BAs while maintaining project momentum?",
      followUpHint: "Share repeatable mentoring mechanisms.",
    },
  ],
};

const QA_QUESTIONS: TrackQuestionSet = {
  intern: [
    {
      id: "qa-intro-intern",
      topic: "Self-introduction",
      prompt:
        "Please introduce yourself and explain why QA matters in product teams.",
      followUpHint: "Connect quality to user trust and business value.",
    },
    {
      id: "qa-testcase-intern",
      topic: "Test design",
      prompt: "How would you design test cases for a login feature?",
      followUpHint: "Cover positive, negative, and edge scenarios.",
    },
    {
      id: "qa-bug-intern",
      topic: "Bug reporting",
      prompt: "What makes a bug report useful for developers?",
      followUpHint: "Mention reproducibility and expected vs actual behavior.",
    },
  ],
  junior: [
    {
      id: "qa-priority-junior",
      topic: "Risk-based testing",
      prompt:
        "How do you prioritize testing when release time is very limited?",
      followUpHint: "Use risk, impact, and critical path.",
    },
    {
      id: "qa-regression-junior",
      topic: "Regression control",
      prompt: "How do you reduce regression risk across frequent releases?",
      followUpHint: "Discuss automation scope and smoke checks.",
    },
    {
      id: "qa-triage-junior",
      topic: "Bug triage",
      prompt: "How do you communicate bug severity with PM and engineers?",
      followUpHint: "Align with user impact and reproducibility confidence.",
    },
  ],
  mid: [
    {
      id: "qa-strategy-mid",
      topic: "Testing strategy",
      prompt:
        "How would you design a test strategy for a realtime interview coach product?",
      followUpHint:
        "Include functional, non-functional, and data-quality checks.",
    },
    {
      id: "qa-automation-mid",
      topic: "Automation planning",
      prompt: "How do you decide what to automate vs keep manual?",
      followUpHint: "Use stability, ROI, and maintenance cost.",
    },
    {
      id: "qa-global-mid",
      topic: "Global collaboration",
      prompt:
        "How do you sync testing expectations in a distributed Vietnam-Korea team?",
      followUpHint: "Discuss definition-of-done and communication rhythm.",
    },
  ],
  senior: [
    {
      id: "qa-lead-senior",
      topic: "QA leadership",
      prompt: "How do you build a quality culture beyond the QA team?",
      followUpHint: "Show how you influence process and engineering habits.",
    },
    {
      id: "qa-metric-senior",
      topic: "Quality metrics",
      prompt:
        "Which quality metrics do you track and how do you prevent metric misuse?",
      followUpHint: "Focus on decision usefulness, not vanity numbers.",
    },
    {
      id: "qa-incident-senior",
      topic: "Post-release quality",
      prompt:
        "A major bug escaped to production. How do you lead the response?",
      followUpHint: "Cover triage, communication, and prevention plan.",
    },
  ],
};

const QUESTION_BANK: Record<InterviewTrack, TrackQuestionSet> = {
  software_engineer: SOFTWARE_ENGINEER_QUESTIONS,
  business_analyst: BA_QUESTIONS,
  qa_tester: QA_QUESTIONS,
};

export function getQuestionSet(
  track: InterviewTrack,
  level: InterviewLevel,
): InterviewQuestion[] {
  return QUESTION_BANK[track][level];
}
