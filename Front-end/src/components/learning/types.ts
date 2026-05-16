export type LearningMode =
  | "complete-sentence"
  | "complete-sentence-meaning"
  | "1Eng-4Vn-words"
  | "1Vn-4Eng-words"
  | "complete-word"
  | "complete-sentence-word-kind";

export type QuestionData = {
  sentence: string;
  answerOptions: string[];
  rightAnswer: string;
  explanation?: string;
};

export const LETTERS = ["a", "b", "c", "d"];

export const modeDescriptions: Record<LearningMode, string> = {
  "complete-sentence": "Complete Sentence",
  "complete-sentence-meaning": "Sentence Meaning",
  "1Eng-4Vn-words": "English → Vietnamese",
  "1Vn-4Eng-words": "Vietnamese → English",
  "complete-word": "Build the Word",
  "complete-sentence-word-kind": "Word Type",
};

export const modeInstructions: Record<LearningMode, string> = {
  "complete-sentence": "Choose the word that best completes the sentence.",
  "complete-sentence-meaning": "Choose the correct meaning of this sentence.",
  "1Eng-4Vn-words": "Choose the correct Vietnamese meaning.",
  "1Vn-4Eng-words": "Choose the correct English word.",
  "complete-word": "Arrange the letters to complete the word.",
  "complete-sentence-word-kind": "Choose the correct word type.",
};