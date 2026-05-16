"use client";

import { useEffect, useRef, useState } from "react";
import type { WordEntryRowValue } from "./NewWordForm";

const wordTypeOptions = [
  { value: "noun", label: "Noun" },
  { value: "verb", label: "Verb" },
  { value: "adj", label: "Adj" },
  { value: "adv", label: "Adv" },
  { value: "phrase", label: "Phrase" },
];

type WordEntryRowProps = {
  index: number;
  canDelete: boolean;
  value: WordEntryRowValue;
  topics: string[];
  onChange: <K extends keyof WordEntryRowValue>(
    field: K,
    value: WordEntryRowValue[K]
  ) => void;
  onDelete: () => void;
  onOpenCreateTopic: () => void;
  onOpenManageTopics: () => void;
};

export default function WordEntryRow({
  index,
  canDelete,
  value,
  topics,
  onChange,
  onDelete,
  onOpenCreateTopic,
  onOpenManageTopics,
}: WordEntryRowProps) {
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const typeDropdownRef = useRef<HTMLDivElement | null>(null);

  const selectedTypes = value.types;

  const selectedTypeLabels =
    selectedTypes.length > 0
      ? wordTypeOptions
          .filter((type) => selectedTypes.includes(type.value))
          .map((type) => type.label)
          .join(", ")
      : "Select Type";

  function toggleType(typeValue: string) {
    const nextTypes = selectedTypes.includes(typeValue)
      ? selectedTypes.filter((type) => type !== typeValue)
      : [...selectedTypes, typeValue];

    onChange("types", nextTypes);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        typeDropdownRef.current &&
        !typeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsTypeDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isSuccess =
    value.status?.toLowerCase().includes("success") ||
    value.status?.toLowerCase().includes("created");

  return (
    <div className="pt-6 px-6 pb-6 rounded-xl bg-surface border border-outline-variant shadow-sm space-y-4">
      <div className="flex justify-between items-center border-b border-outline-variant pb-4">
        <h4 className="text-label-sm font-bold uppercase text-outline">
          New Word Entry {index + 1}

          {value.status && (
            <span
              className={`ml-3 normal-case text-xs font-medium ${
                isSuccess ? "text-green-600" : "text-error"
              }`}
            >
              {value.status}
            </span>
          )}
        </h4>

        <button
          type="button"
          onClick={onDelete}
          disabled={!canDelete}
          className="h-8 w-8 flex items-center justify-center text-error hover:bg-error-container/20 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Delete row"
        >
          <span className="material-symbols-outlined">delete</span>
        </button>
      </div>

      <div className="flex flex-wrap md:flex-nowrap gap-3 items-start">
        <div className="flex-1 min-w-[150px] space-y-1">
          <label className="text-label-sm text-on-surface-variant font-medium">
            English Word
          </label>

          <input
            value={value.english}
            onChange={(event) => onChange("english", event.target.value)}
            className="w-full h-[42px] bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2 text-body-md form-input-focus"
            placeholder="e.g. Word"
            type="text"
          />
        </div>

        <div className="flex-1 min-w-[150px] space-y-1">
          <label className="text-label-sm text-on-surface-variant font-medium">
            Word Type
          </label>

          <div className="relative" ref={typeDropdownRef}>
            <button
              type="button"
              onClick={() => setIsTypeDropdownOpen((isOpen) => !isOpen)}
              className={`w-full h-[42px] bg-surface-container-low border rounded-lg px-4 py-2 pr-10 text-body-md text-left cursor-pointer form-input-focus ${
                isTypeDropdownOpen
                  ? "border-primary-container"
                  : "border-outline-variant"
              }`}
            >
              <span
                className={
                  selectedTypes.length > 0
                    ? "text-on-surface"
                    : "text-on-surface-variant"
                }
              >
                {selectedTypeLabels}
              </span>
            </button>

            <span className="material-symbols-outlined absolute right-3 top-[21px] -translate-y-1/2 pointer-events-none text-outline">
              arrow_drop_down
            </span>

            {isTypeDropdownOpen && (
              <div className="absolute left-0 right-0 top-[46px] z-50 rounded-lg border border-outline-variant bg-surface-container-lowest shadow-lg overflow-hidden">
                {wordTypeOptions.map((type) => {
                  const isChecked = selectedTypes.includes(type.value);

                  return (
                    <label
                      key={type.value}
                      className="flex items-center gap-3 px-4 py-2 text-body-md text-on-surface hover:bg-surface-container-low cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleType(type.value)}
                        className="h-4 w-4 accent-primary cursor-pointer"
                      />

                      <span>{type.label}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-[150px] space-y-1">
          <label className="text-label-sm text-on-surface-variant font-medium">
            Synonyms
          </label>

          <input
            value={value.synonyms}
            onChange={(event) => onChange("synonyms", event.target.value)}
            className="w-full h-[42px] bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2 text-body-md form-input-focus"
            placeholder="synonyms"
            type="text"
          />
        </div>

        <div className="flex-1 min-w-[180px] space-y-1">
          <label className="text-label-sm text-on-surface-variant font-medium">
            Meaning
          </label>

          <input
            value={value.meaning}
            onChange={(event) => onChange("meaning", event.target.value)}
            className="w-full h-[42px] bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2 text-body-md form-input-focus"
            placeholder="Definition"
            type="text"
          />
        </div>

        <div className="flex-1 min-w-[180px] space-y-1">
          <label className="text-label-sm text-on-surface-variant font-medium">
            Topic
          </label>

          <div className="relative">
            <select
              value={value.topic}
              onChange={(event) => onChange("topic", event.target.value)}
              className="w-full h-[42px] appearance-none bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2 pr-10 text-body-md form-input-focus cursor-pointer"
            >
              <option value="" disabled>
                Select Topic
              </option>

              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>

            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline">
              arrow_drop_down
            </span>
          </div>

          <div className="mt-1 flex justify-end gap-3 relative z-20 pointer-events-auto">
            <button
              type="button"
              onClick={onOpenCreateTopic}
              className="relative z-20 cursor-pointer text-[10px] text-primary hover:underline whitespace-nowrap pointer-events-auto"
            >
              Create Topic
            </button>

            <button
              type="button"
              onClick={onOpenManageTopics}
              className="relative z-20 cursor-pointer text-[10px] text-primary hover:underline whitespace-nowrap pointer-events-auto"
            >
              Manage Topics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}