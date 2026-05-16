"use client";

import { useState } from "react";

type ManageTopicsModalProps = {
  isOpen: boolean;
  topics: string[];
  onClose: () => void;
  onDeleteTopic: (topicName: string) => Promise<void> | void;
};

export default function ManageTopicsModal({
  isOpen,
  topics,
  onClose,
  onDeleteTopic,
}: ManageTopicsModalProps) {
  const [deletingTopic, setDeletingTopic] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  async function handleDelete(topicName: string) {
    const confirmed = window.confirm(
      `Delete topic "${topicName}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingTopic(topicName);
      setErrorMessage("");

      await onDeleteTopic(topicName);
    } catch (error) {
      console.error("Delete topic error:", error);
      setErrorMessage("Delete topic failed. Please try again.");
    } finally {
      setDeletingTopic("");
    }
  }

  function handleClose() {
    if (deletingTopic) return;

    setErrorMessage("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-inverse-surface/40 backdrop-blur-sm px-margin-mobile">
      <div className="bg-surface-container-lowest w-full max-w-md rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden">
        <div className="px-gutter pt-gutter pb-stack-md border-b border-outline-variant">
          <h2 className="font-headline-md text-headline-md text-on-surface">
            Manage Topics
          </h2>

          <p className="mt-1 text-body-sm text-on-surface-variant">
            Delete topics that you no longer use.
          </p>
        </div>

        <div className="px-gutter py-stack-md max-h-[320px] overflow-y-auto">
          {topics.length === 0 ? (
            <div className="py-8 text-center text-body-sm text-on-surface-variant">
              No topics found.
            </div>
          ) : (
            <div className="space-y-2">
              {topics.map((topic) => (
                <div
                  key={topic}
                  className="flex items-center justify-between gap-3 rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3"
                >
                  <span className="text-body-md text-on-surface">
                    {topic}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDelete(topic)}
                    disabled={deletingTopic === topic}
                    className="h-8 w-8 flex items-center justify-center rounded-lg text-error hover:bg-error-container/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={`Delete ${topic}`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {deletingTopic === topic ? "hourglass_empty" : "delete"}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {errorMessage && (
            <p className="mt-stack-md text-body-sm text-error">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="px-gutter py-gutter flex items-center justify-end bg-surface-container-lowest border-t border-outline-variant">
          <button
            type="button"
            onClick={handleClose}
            disabled={Boolean(deletingTopic)}
            className="px-6 py-2.5 rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}