"use client";

import { useEffect, useState } from "react";
import CreateTopicModal from "./CreateTopicModal";
import ManageTopicsModal from "./ManageTopicsModal";
import WordEntryRow from "./WordEntryRow";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export type WordEntryRowValue = {
  id: string;
  english: string;
  types: string[];
  synonyms: string;
  meaning: string;
  topic: string;
  status?: string;
};

function createEmptyRow(): WordEntryRowValue {
  return {
    id: crypto.randomUUID(),
    english: "",
    types: [],
    synonyms: "",
    meaning: "",
    topic: "",
    status: "",
  };
}

export default function NewWordForm() {
  const [rows, setRows] = useState<WordEntryRowValue[]>([
    createEmptyRow(),
    // createEmptyRow(),
  ]);

  const [topics, setTopics] = useState<string[]>([]);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const [topicError, setTopicError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isCreateTopicOpen, setIsCreateTopicOpen] = useState(false);
  const [isManageTopicsOpen, setIsManageTopicsOpen] = useState(false);

  useEffect(() => {
    fetchTopics();
  }, []);

  async function fetchTopics() {
    if (!apiUrl) {
      setTopicError("Missing NEXT_PUBLIC_API_URL in .env");
      return;
    }

    try {
      setIsLoadingTopics(true);
      setTopicError("");

      const response = await fetch(`${apiUrl}/categories`);

      if (!response.ok) {
        throw new Error("Failed to fetch topics.");
      }

      const data = await response.json();

      const categoryNames = Array.isArray(data.categories)
        ? data.categories
        : [];

      setTopics(categoryNames);
    } catch (error) {
      console.error("Fetch topics error:", error);
      setTopicError("Cannot load topics from server.");
    } finally {
      setIsLoadingTopics(false);
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
      body: JSON.stringify({
        categoryName: topicName,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);

      throw new Error(
        errorData?.message || errorData?.error || "Create topic failed."
      );
    }

    await fetchTopics();
  }

  async function handleDeleteTopic(topicName: string) {
    if (!apiUrl) {
      throw new Error("Missing NEXT_PUBLIC_API_URL in .env");
    }

    const response = await fetch(`${apiUrl}/categories`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        categoryName: topicName,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);

      throw new Error(
        errorData?.message || errorData?.error || "Delete topic failed."
      );
    }

    await fetchTopics();

    setRows((currentRows) =>
      currentRows.map((row) =>
        row.topic === topicName ? { ...row, topic: "" } : row
      )
    );
  }

  function handleAddRow() {
    setSuccessMessage("");

    setRows((currentRows) => [...currentRows, createEmptyRow()]);
  }

  function handleDeleteRow(rowId: string) {
    setRows((currentRows) => {
      if (currentRows.length <= 1) return currentRows;

      return currentRows.filter((row) => row.id !== rowId);
    });
  }

  function handleRowChange<K extends keyof WordEntryRowValue>(
    rowId: string,
    field: K,
    value: WordEntryRowValue[K]
  ) {
    setRows((currentRows) =>
      currentRows.map((row) =>
        row.id === rowId
          ? {
            ...row,
            [field]: value,
            status: "",
          }
          : row
      )
    );
  }

  function handleResetRows() {
    setSuccessMessage("");
    setRows([createEmptyRow()]);
  }

  function showSuccessMessage(message: string) {
    setSuccessMessage(message);

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  }

  async function handleSubmit() {
    if (!apiUrl) {
      setTopicError("Missing NEXT_PUBLIC_API_URL in .env");
      return;
    }

    try {
      setIsSubmitting(true);

      const updatedRows = await Promise.all(
        rows.map(async (row) => {
          if (
            !row.english.trim() ||
            !row.meaning.trim() ||
            row.types.length === 0
          ) {
            return {
              ...row,
              status: "Missing English Word, Meaning, or Word Type.",
              success: false,
            };
          }

          try {
            const response = await fetch(`${apiUrl}/words`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                engMeaning: row.english.trim(),
                vnMeaning: row.meaning.trim(),
                wordKind: row.types,
                category: row.topic || "",
                synonyms: row.synonyms.trim(),
              }),
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
              throw new Error(
                data?.message || data?.error || "Create word failed."
              );
            }

            return {
              ...row,
              status: "Created successfully.",
              success: true,
            };
          } catch (error) {
            const message =
              error instanceof Error ? error.message : "Create word failed.";

            return {
              ...row,
              status: message,
              success: false,
            };
          }
        })
      );

      const failedRows = updatedRows.filter(
        (row) =>
          !row.status?.toLowerCase().includes("success") &&
          !row.status?.toLowerCase().includes("created")
      );

      // if (failedRows.length > 0) {
      //   setRows(failedRows);
      //   return;
      // }
      if (failedRows.length > 0) {
        const successCount = updatedRows.length - failedRows.length;

        setRows(failedRows);

        if (successCount > 0) {
          showSuccessMessage(
            successCount === 1
              ? "Created 1 word successfully."
              : `Created ${successCount} words successfully.`
          );
        }

        return;
      }

      const successCount = updatedRows.length - failedRows.length;

      setRows([createEmptyRow()]);

      showSuccessMessage(
        successCount === 1
          ? "Created 1 word successfully."
          : `Created ${successCount} words successfully.`
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="bg-surface shadow-md rounded-xl border border-outline-variant overflow-hidden">
        {/* <div className="p-stack-lg border-b border-outline-variant bg-surface-container-lowest">
          <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2"> */}
          <div className="p-4 md:p-stack-lg border-b border-outline-variant bg-surface-container-lowest">
  <h3 className="font-headline-sm text-[20px] md:text-headline-sm text-on-surface flex items-center gap-2">
            Create New Words
          </h3>

          {isLoadingTopics && (
            <div className="mt-2 flex items-center gap-1.5 text-[13px] text-on-surface-variant">
              <span>Loading topics</span>

              <span className="flex items-center gap-0.5">
                <span className="h-1 w-1 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                <span className="h-1 w-1 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                <span className="h-1 w-1 rounded-full bg-primary animate-bounce" />
              </span>
            </div>
          )}

          {topicError && (
            <p className="text-body-sm text-error mt-2">
              {topicError}
            </p>
          )}
          {successMessage && (
            <p className="text-body-sm text-success mt-2">
              {successMessage}
            </p>
          )}
        </div>

        {/* <div className="p-stack-lg space-y-stack-md"> */}
        <div className="p-4 md:p-stack-lg space-y-stack-md">
          <div className="space-y-stack-md">
            {rows.map((row, index) => (
              <WordEntryRow
                key={row.id}
                index={index}
                canDelete={rows.length > 1}
                value={row}
                topics={topics}
                onChange={(field, value) =>
                  handleRowChange(row.id, field, value)
                }
                onDelete={() => handleDeleteRow(row.id)}
                onOpenCreateTopic={() => setIsCreateTopicOpen(true)}
                onOpenManageTopics={() => setIsManageTopicsOpen(true)}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddRow}
            // className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-outline-variant rounded-xl text-primary font-bold hover:bg-primary-container/10 transition-colors"
         className="flex items-center justify-center gap-2 w-full py-3 md:py-4 border-2 border-dashed border-outline-variant rounded-xl text-primary font-bold hover:bg-primary-container/10 transition-colors"
         >
            <span className="material-symbols-outlined">add_circle</span>
            Add Row
          </button>
        </div>

        {/* <div className="p-stack-lg bg-surface-container-low flex justify-end items-center gap-stack-md"> */}
          <div className="p-4 md:p-stack-lg bg-surface-container-low flex justify-end items-center gap-3">
          <button
            type="button"
            onClick={handleResetRows}
            disabled={isSubmitting}
            // className="px-6 py-2.5 rounded-lg font-bold text-on-surface hover:bg-surface-container-high transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          className="px-4 md:px-6 py-2 rounded-lg font-bold text-on-surface hover:bg-surface-container-high transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            // className="px-stack-lg py-2.5 bg-primary text-on-primary rounded-lg font-bold shadow-sm hover:opacity-90 transition-opacity active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          className="px-5 md:px-stack-lg py-2 bg-primary text-on-primary rounded-lg font-bold shadow-sm hover:opacity-90 transition-opacity active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating..." : "Create"}
          </button>
        </div>
      </div>

      <CreateTopicModal
        isOpen={isCreateTopicOpen}
        onClose={() => setIsCreateTopicOpen(false)}
        onSave={handleCreateTopic}
      />

      <ManageTopicsModal
        isOpen={isManageTopicsOpen}
        topics={topics}
        onClose={() => setIsManageTopicsOpen(false)}
        onDeleteTopic={handleDeleteTopic}
      />
    </>
  );
}