export type Word = {
  english: string;
  vietnamese: string;
  synonyms: string;
  type: string;
  category?: string;
};

export type WordTypeOption = {
  value: string;
  label: string;
};

export const wordTypes: WordTypeOption[] = [
  { value: "noun", label: "Noun" },
  { value: "verb", label: "Verb" },
  { value: "adj", label: "Adj" },
  { value: "adv", label: "Adv" },
  { value: "phrase", label: "Phrase" },
];