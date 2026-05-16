"use client";

import { useState } from "react";

type CreateTopicModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (topicName: string) => Promise<void> | void;
};

export default function CreateTopicModal({
  isOpen,
  onClose,
  onSave,
}: CreateTopicModalProps) {
  const [topicName, setTopicName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  async function handleSave() {
    const trimmedTopicName = topicName.trim();

    if (!trimmedTopicName) {
      setErrorMessage("Please enter a topic name.");
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage("");

      await onSave(trimmedTopicName);

      setTopicName("");
      onClose();
    } catch (error) {
      console.error("Create topic error:", error);
      setErrorMessage("Create topic failed. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleClose() {
    if (isSaving) return;

    setTopicName("");
    setErrorMessage("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-inverse-surface/40 backdrop-blur-sm px-margin-mobile">
      <div className="bg-surface-container-lowest w-full max-w-md rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden">
        <div className="px-gutter pt-gutter pb-stack-md">
          <h2 className="font-headline-md text-headline-md text-on-surface">
            Create New Topic
          </h2>
        </div>

        <div className="px-gutter py-stack-sm">
          <label
            className="block font-label-md text-label-md mb-stack-sm text-on-surface-variant"
            htmlFor="topic-name"
          >
            Topic Name
          </label>

          <input
            id="topic-name"
            value={topicName}
            onChange={(event) => setTopicName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSave();
              }

              if (event.key === "Escape") {
                handleClose();
              }
            }}
            className="w-full bg-white border border-outline-variant rounded-lg p-3 pl-4 focus:ring-2 focus:ring-primary-container/30 focus:border-primary outline-none transition-all font-body-md text-body-md placeholder:text-outline-variant"
            placeholder="e.g. Science, Literature"
            type="text"
            disabled={isSaving}
            autoFocus
          />

          <p className="mt-stack-sm font-body-sm text-body-sm text-on-surface-variant/70">
            Topics help you group vocabulary for focused revision sessions.
          </p>

          {errorMessage && (
            <p className="mt-stack-sm text-body-sm text-error">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="px-gutter py-gutter mt-stack-md flex items-center justify-end gap-stack-md bg-surface-container-lowest">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !topicName.trim()}
            className="px-6 py-2.5 rounded-lg font-label-md text-label-md bg-primary text-on-primary hover:opacity-90 shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save Topic"}
          </button>
        </div>
      </div>
    </div>
  );
}