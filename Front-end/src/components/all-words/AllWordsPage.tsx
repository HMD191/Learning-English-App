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

type FilterPayload = {
  categories: string[];
  wordKinds: string[];
};

export default function AllWordsPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [topics, setTopics] = useState<string[]>([]);

  const [isLoadingWords, setIsLoadingWords] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopicFilter, setSelectedTopicFilter] = useState("");

  const [selectedFilterCategories, setSelectedFilterCategories] = useState<
    string[]
  >([]);
  const [selectedFilterWordKinds, setSelectedFilterWordKinds] = useState<
    string[]
  >([]);
  const [isFiltering, setIsFiltering] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const [originalEnglish, setOriginalEnglish] = useState<string | null>(null);
  const [editedWord, setEditedWord] = useState<Word | null>(null);

  const [wordToDelete, setWordToDelete] = useState<string | null>(null);
  const [isCreateTopicOpen, setIsCreateTopicOpen] = useState(false);

  useEffect(() => {
    fetchWords();
    fetchTopics();
  }, []);

  function mapBackendWords(wordsFromApi: any[]): Word[] {
    return wordsFromApi.map((word: any) => ({
      english: word.engMeaning || word.english || "",
      vietnamese: word.vnMeaning || word.vietnamese || "",
      synonyms: word.synonyms || "",
      type: Array.isArray(word.wordKind)
        ? word.wordKind.join(", ")
        : word.wordKind || word.type || "",
      category: word.category || "",
    }));
  }

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
        ? mapBackendWords(data.words)
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

  async function handleApplyFilter(filters: FilterPayload) {
    if (!apiUrl) {
      setErrorMessage("Missing NEXT_PUBLIC_API_URL in .env");
      return;
    }

    try {
      setIsFiltering(true);
      setIsLoadingWords(true);
      setErrorMessage("");

      const hasNoFilter =
        filters.categories.length === 0 && filters.wordKinds.length === 0;

      if (hasNoFilter) {
        setSelectedFilterCategories([]);
        setSelectedFilterWordKinds([]);
        setCurrentPage(1);
        await fetchWords();
        return;
      }

      // const response = await fetch(`${apiUrl}/words/filter`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     "ngrok-skip-browser-warning": "true",
      //   },
      //   body: JSON.stringify({
      //     categories: filters.categories,
      //     wordKinds: filters.wordKinds,
      //   }),
        
      // });

      const filterBody = {
  categories: filters.categories,
  wordKinds: filters.wordKinds,
};

console.log("Filter body:", filterBody);

const response = await fetch(`${apiUrl}/words/filter`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
  body: JSON.stringify(filterBody),
});

if (!response.ok) {
  const errorData = await response.json().catch(() => null);
  console.error("Filter API error:", errorData);

  throw new Error(
    errorData?.message || errorData?.error || "Filter words failed."
  );
}

      // if (!response.ok) {
      //   throw new Error("Filter words failed.");
      // }

      const data = await response.json();

      const wordsFromApi = Array.isArray(data.words)
        ? data.words
        : Array.isArray(data.filteredWords)
        ? data.filteredWords
        : Array.isArray(data.result)
        ? data.result
        : Array.isArray(data)
        ? data
        : [];

      setWords(mapBackendWords(wordsFromApi));
      setSelectedFilterCategories(filters.categories);
      setSelectedFilterWordKinds(filters.wordKinds);
      setCurrentPage(1);
    } catch (error) {
      console.error("Filter words error:", error);
      setErrorMessage("Filter words failed. Please try again.");
    } finally {
      setIsFiltering(false);
      setIsLoadingWords(false);
    }
  }

  async function handleClearFilter() {
    setSelectedFilterCategories([]);
    setSelectedFilterWordKinds([]);
    setCurrentPage(1);
    await fetchWords();
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

  const totalPages = Math.max(1, Math.ceil(filteredWords.length / pageSize));

  const paginatedWords = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return filteredWords.slice(startIndex, endIndex);
  }, [filteredWords, currentPage]);

  const showingStart =
    filteredWords.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;

  const showingEnd = Math.min(currentPage * pageSize, filteredWords.length);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedTopicFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="max-w-container-max mx-auto space-y-stack-lg">
      <div className="space-y-2">
        <AllWordsHeader
          topics={topics}
          selectedCategories={selectedFilterCategories}
          selectedWordKinds={selectedFilterWordKinds}
          isFiltering={isFiltering}
          onApplyFilter={handleApplyFilter}
          onClearFilter={handleClearFilter}
        />

        <AllWordsStats totalWords={words.length} totalTopics={topics.length} />
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-error-container bg-error-container/60 px-4 py-3 text-[14px] text-on-error-container">
          {errorMessage}
        </div>
      )}

      <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <WordsTable
          words={paginatedWords}
          startIndex={(currentPage - 1) * pageSize}
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
            Showing {showingStart}-{showingEnd} of {filteredWords.length} words
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-surface-container-low text-on-surface-variant transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <span className="material-symbols-outlined">
                keyboard_arrow_left
              </span>
            </button>

            <button
              type="button"
              className="min-w-8 h-8 px-3 rounded-lg bg-primary text-on-primary text-label-sm font-bold"
            >
              {currentPage}
            </button>

            <span className="text-label-sm text-on-surface-variant">
              of {totalPages}
            </span>

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-surface-container-low text-on-surface-variant transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next page"
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