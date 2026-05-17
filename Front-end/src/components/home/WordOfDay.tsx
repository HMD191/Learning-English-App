"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type WordItem = {
  english: string;
  meaning: string;
  type: string;
  synonyms: string;
  category: string;
};

export default function WordOfDay() {
  const [selectedWord, setSelectedWord] = useState<WordItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchWords();
  }, []);

  async function fetchWords() {
    if (!apiUrl) {
      setErrorMessage("Missing NEXT_PUBLIC_API_URL in .env");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await fetch(`${apiUrl}/words`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch words.");
      }

      const data = await response.json();

      const mappedWords: WordItem[] = Array.isArray(data.words)
        ? data.words.map((word: any) => ({
            english: word.engMeaning || "",
            meaning: word.vnMeaning || "",
            type: Array.isArray(word.wordKind)
              ? word.wordKind.join(", ")
              : word.wordKind || "",
            synonyms: word.synonyms || "",
            category: word.category || "",
          }))
        : [];

      if (mappedWords.length > 0) {
        setSelectedWord(getRandomWord(mappedWords));
      }
    } catch (error) {
      console.error("Fetch word of day error:", error);
      setErrorMessage("Cannot load word of the day.");
    } finally {
      setIsLoading(false);
    }
  }

  function getRandomWord(wordList: WordItem[]) {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    return wordList[randomIndex];
  }

  function speakText(text: string) {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;

    const voices = speechSynthesis.getVoices();
    const selectedVoice = voices.find(
      (voice) => voice.lang === "en-US" && voice.name.includes("Google")
    );

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  }

  if (isLoading) {
    return (
      <div className="border-l-4 border-primary bg-surface-container-low p-stack-lg rounded-r-xl">
        <div className="animate-pulse space-y-3">
          <div className="h-5 w-40 bg-surface-container-high rounded-full" />
          <div className="h-7 w-56 bg-surface-container-high rounded-lg" />
          <div className="h-5 w-full bg-surface-container-high rounded-lg" />
        </div>
      </div>
    );
  }

  if (errorMessage || !selectedWord) {
    return (
      <div className="border-l-4 border-error bg-error-container/40 p-stack-lg rounded-r-xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-error">error</span>
          <h4 className="font-headline-sm text-error">Word of the Day</h4>
        </div>

        <p className="text-body-md text-on-surface-variant">
          {errorMessage || "No words found."}
        </p>
      </div>
    );
  }

  return (
    <div className="border-l-4 border-primary bg-surface-container-low p-stack-lg rounded-r-xl">
      <div className="flex items-center gap-2 mb-2">
        <span className="material-symbols-outlined text-primary">
          lightbulb
        </span>

        <h4 className="font-headline-sm text-primary">Word of the Day</h4>
      </div>

      <p className="text-on-surface mb-1 font-bold text-lg">
        {selectedWord.english}

        {selectedWord.type && (
          <span className="ml-2 text-on-surface-variant font-normal text-sm italic">
            {selectedWord.type}
          </span>
        )}
      </p>

      <p className="text-body-md text-on-surface-variant italic">
        &quot;{selectedWord.meaning || "No meaning available."}&quot;
      </p>

      {selectedWord.synonyms && (
        <p className="mt-2 text-body-sm text-on-surface-variant">
          <span className="font-semibold text-on-surface">Synonyms:</span>{" "}
          {selectedWord.synonyms}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/all-words"
          className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary-container/30 transition-colors"
        >
          Go to Library
        </Link>

        <button
          type="button"
          onClick={() => speakText(selectedWord.english)}
          className="px-4 py-2 text-on-surface-variant hover:text-primary flex items-center gap-1"
        >
          <span className="material-symbols-outlined">volume_up</span>
          {/* Listen */}
        </button>
      </div>
    </div>
  );
}