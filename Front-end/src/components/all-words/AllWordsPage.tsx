"use client";

import { useEffect, useMemo, useState } from "react";
import CreateTopicModal from "@/components/new-word/CreateTopicModal";
import AllWordsHeader from "./AllWordsHeader";
import AllWordsStats from "./AllWordsStats";
// import WordsToolbar from "./WordsToolbar";
import WordsTable from "./WordsTable";
import DeleteWordModal from "./DeleteWordModal";
import WeeklyGoalPanel from "./WeeklyGoalPanel";
import { Word } from "./types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function AllWordsPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [topics, setTopics] = useState<string[]>([]);

  const [isLoadingWords, setIsLoadingWords] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopicFilter, setSelectedTopicFilter] = useState("");

  const [originalEnglish, setOriginalEnglish] = useState<string | null>(null);
  const [editedWord, setEditedWord] = useState<Word | null>(null);

  const [wordToDelete, setWordToDelete] = useState<string | null>(null);
  const [isCreateTopicOpen, setIsCreateTopicOpen] = useState(false);

  useEffect(() => {
    fetchWords();
    fetchTopics();
  }, []);

  async function fetchWords() {
    if (!apiUrl) {
      setErrorMessage("Missing NEXT_PUBLIC_API_URL in .env");
      return;
    }

    try {
      setIsLoadingWords(true);
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

      const mappedWords: Word[] = Array.isArray(data.words)
        ? data.words.map((word: any) => ({
            english: word.engMeaning,
            vietnamese: word.vnMeaning,
            synonyms: word.synonyms || "",
            type: Array.isArray(word.wordKind)
              ? word.wordKind.join(", ")
              : word.wordKind || "",
            category: word.category || "",
          }))
        : [];

      setWords(mappedWords);
    } catch (error) {
      console.error("Fetch words error:", error);
      setErrorMessage("Cannot load words from server.");
    } finally {
      setIsLoadingWords(false);
    }
  }

  async function fetchTopics() {
    if (!apiUrl) return;

    try {
      const response = await fetch(`${apiUrl}/categories`);

      if (!response.ok) {
        throw new Error("Failed to fetch topics.");
      }

      const data = await response.json();

      setTopics(Array.isArray(data.categories) ? data.categories : []);
    } catch (error) {
      console.error("Fetch topics error:", error);
    }
  }

  async function handleCreateTopic(topicName: string) {
    if (!apiUrl) {
      throw new Error("Missing NEXT_PUBLIC_API_URL in .env");
    }

    const response = await fetch(`${apiUrl}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ categoryName: topicName }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);

      throw new Error(
        errorData?.message || errorData?.error || "Create topic failed."
      );
    }

    await fetchTopics();

    setEditedWord((current) =>
      current ? { ...current, category: topicName } : current
    );
  }

  function handleEdit(word: Word) {
    setOriginalEnglish(word.english);
    setEditedWord({ ...word });
  }

  function handleCancelEdit() {
    setOriginalEnglish(null);
    setEditedWord(null);
  }

  async function handleSaveEdit() {
    if (!apiUrl || !editedWord || !originalEnglish) return;

    try {
      const response = await fetch(`${apiUrl}/words`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          engMeaning: originalEnglish,
          newEngMeaning: editedWord.english,
          vnMeaning: editedWord.vietnamese,
          synonyms: editedWord.synonyms,
          wordKind: editedWord.type
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          category: editedWord.category || "",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.message || errorData?.error || "Update word failed."
        );
      }

      await fetchWords();
      handleCancelEdit();
    } catch (error) {
      console.error("Update word error:", error);
      setErrorMessage("Update word failed. Please try again.");
    }
  }

  async function handleDeleteWord() {
    if (!apiUrl || !wordToDelete) return;

    try {
      const response = await fetch(
        `${apiUrl}/words/${encodeURIComponent(wordToDelete)}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Delete word failed.");
      }

      setWords((currentWords) =>
        currentWords.filter((word) => word.english !== wordToDelete)
      );

      setWordToDelete(null);
    } catch (error) {
      console.error("Delete word error:", error);
      setErrorMessage("Delete word failed. Please try again.");
    }
  }

  function speakText(text: string) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";

    const voices = speechSynthesis.getVoices();
    const selectedVoice = voices.find(
      (voice) => voice.lang === "en-US" && voice.name.includes("Google")
    );

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    speechSynthesis.speak(utterance);
  }

  function handleEditedWordChange(field: keyof Word, value: string) {
    setEditedWord((current) => {
      if (!current) return current;

      return {
        ...current,
        [field]: value,
      };
    });
  }

  function toggleEditedWordType(typeValue: string) {
    setEditedWord((current) => {
      if (!current) return current;

      const currentTypes = current.type
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const nextTypes = currentTypes.includes(typeValue)
        ? currentTypes.filter((item) => item !== typeValue)
        : [...currentTypes, typeValue];

      return {
        ...current,
        type: nextTypes.join(", "),
      };
    });
  }

  const filteredWords = useMemo(() => {
    return words.filter((word) => {
      const query = searchQuery.trim().toLowerCase();

      const matchesSearch =
        !query ||
        word.english.toLowerCase().includes(query) ||
        word.vietnamese.toLowerCase().includes(query) ||
        word.synonyms?.toLowerCase().includes(query) ||
        word.type.toLowerCase().includes(query) ||
        word.category?.toLowerCase().includes(query);

      const matchesTopic =
        !selectedTopicFilter || word.category === selectedTopicFilter;

      return matchesSearch && matchesTopic;
    });
  }, [words, searchQuery, selectedTopicFilter]);

  return (
    <div className="max-w-container-max mx-auto space-y-stack-lg">
      <AllWordsHeader />

      <AllWordsStats totalWords={words.length} totalTopics={topics.length} />

      <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        

        <WordsTable
          words={filteredWords}
          topics={topics}
          isLoading={isLoadingWords}
          originalEnglish={originalEnglish}
          editedWord={editedWord}
          onEdit={handleEdit}
          onSave={handleSaveEdit}
          onDelete={setWordToDelete}
          onSpeak={speakText}
          onEditedWordChange={handleEditedWordChange}
          onToggleType={toggleEditedWordType}
          onOpenCreateTopic={() => setIsCreateTopicOpen(true)}
        />

        <div className="px-6 py-4 border-t border-outline-variant flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-label-sm text-on-surface-variant">
            Showing {filteredWords.length} of {words.length} words
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled
              className="p-2 rounded-lg hover:bg-surface-container-low text-on-surface-variant transition-colors disabled:opacity-30"
            >
              <span className="material-symbols-outlined">
                keyboard_arrow_left
              </span>
            </button>

            <button
              type="button"
              className="w-8 h-8 rounded bg-primary text-on-primary text-label-sm"
            >
              1
            </button>

            <button
              type="button"
              disabled
              className="p-2 rounded-lg hover:bg-surface-container-low text-on-surface-variant transition-colors disabled:opacity-30"
            >
              <span className="material-symbols-outlined">
                keyboard_arrow_right
              </span>
            </button>
          </div>
        </div>
      </section>

      <WeeklyGoalPanel />

      <DeleteWordModal
        wordToDelete={wordToDelete}
        onCancel={() => setWordToDelete(null)}
        onConfirm={handleDeleteWord}
      />

      <CreateTopicModal
        isOpen={isCreateTopicOpen}
        onClose={() => setIsCreateTopicOpen(false)}
        onSave={handleCreateTopic}
      />
    </div>
  );
}