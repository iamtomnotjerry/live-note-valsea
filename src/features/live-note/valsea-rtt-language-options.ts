/**
 * Mã `language` cho VALSEA RTT `session.start` (khớp docs transcription / realtime).
 * Thứ tự ưu tiên Đông Nam Á & lân cận (hackathon / EdTech SEA).
 * @see https://valsea.ai/docs/realtime
 */
export const VALSEA_RTT_LANGUAGE_CODES = [
  "vietnamese",
  "thai",
  "indonesian",
  "malay",
  "filipino",
  "javanese",
  "khmer",
  "lao",
  "singlish",
  "tamil",
  "malayalam",
  "bengali-bd",
  "bengali-in",
  "cantonese",
  "chinese-simplified",
  "chinese-traditional",
  "chinese",
  "english",
  "english-us",
  "english-gb",
  "english-au",
  "english-philippines",
  "english-in",
  "hindi",
  "telugu",
  "punjabi",
  "nepali",
  "japanese",
  "korean",
  "french",
  "spanish",
  "german",
  "portuguese-br",
  "polish",
  "russian",
] as const;

export type ValseaRttLanguageCode = (typeof VALSEA_RTT_LANGUAGE_CODES)[number];
