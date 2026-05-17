"use client";

import { useState } from "react";

type FilterPayload = {
  categories: string[];
  wordKinds: string[];
};

type AllWordsHeaderProps = {
  topics: string[];
  selectedCategories: string[];
  selectedWordKinds: string[];
  isFiltering?: boolean;
  onApplyFilter: (filters: FilterPayload) => Promise<void> | void;
  onClearFilter: () => Promise<void> | void;
};

const wordKindOptions = [
  { value: "noun", label: "Noun" },
  { value: "verb", label: "Verb" },
  { value: "adj", label: "Adjective" },
  { value: "adv", label: "Adverb" },
  { value: "phrase", label: "Phrase" },
];

export default function AllWordsHeader({
  topics,
  selectedCategories,
  selectedWordKinds,
  isFiltering = false,
  onApplyFilter,
  onClearFilter,
}: AllWordsHeaderProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [draftCategories, setDraftCategories] = useState<string[]>([]);
  const [draftWordKinds, setDraftWordKinds] = useState<string[]>([]);

  const activeFilterCount =
    selectedCategories.length + selectedWordKinds.length;

  function openFilterModal() {
    setDraftCategories(selectedCategories);
    setDraftWordKinds(selectedWordKinds);
    setIsFilterOpen(true);
  }

  function closeFilterModal() {
    setIsFilterOpen(false);
  }

  function toggleCategory(category: string) {
    setDraftCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category]
    );
  }

  function toggleWordKind(wordKind: string) {
    setDraftWordKinds((current) =>
      current.includes(wordKind)
        ? current.filter((item) => item !== wordKind)
        : [...current, wordKind]
    );
  }

  async function handleApplyFilter() {
    await onApplyFilter({
      categories: draftCategories,
      wordKinds: draftWordKinds,
    });

    closeFilterModal();
  }

  async function handleClearFilter() {
    setDraftCategories([]);
    setDraftWordKinds([]);

    await onClearFilter();

    closeFilterModal();
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-gutter">
        <div className="mb-2">
          <h1 className="mt-1 text-[28px] leading-10 font-bold tracking-[-0.03em] text-on-surface">
            Your saved words
          </h1>
        </div>

        <div className="flex items-center gap-stack-sm overflow-x-auto pb-2 md:pb-0">
          <button
            type="button"
            onClick={openFilterModal}
            className={`flex items-center gap-2 border px-4 py-2 rounded-lg font-label-md text-label-md transition-all ${
              activeFilterCount > 0
                ? "bg-primary-container border-primary-container text-primary"
                : "bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-container-low"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              filter_list
            </span>
            Filter
            {activeFilterCount > 0 && (
              <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-on-primary">
                {activeFilterCount}
              </span>
            )}
          </button>

          <button
            type="button"
            className="flex items-center gap-2 bg-surface border border-outline-variant px-4 py-2 rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-low transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">
              sort
            </span>
            Sort
          </button>

          <button
            type="button"
            className="flex items-center gap-2 bg-secondary-container text-on-secondary-container px-4 py-2 rounded-lg font-label-md text-label-md hover:opacity-90 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">
              download
            </span>
            Export
          </button>
        </div>
      </div>

      {isFilterOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-inverse-surface/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-outline-variant shadow-[0_20px_50px_rgba(0,0,0,0.16)] overflow-hidden">
            <div className="px-6 py-5 border-b border-outline-variant/70">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-[20px] leading-7 font-bold text-on-surface">
                    Filter words
                  </h2>
                  <p className="mt-1 text-[14px] leading-5 text-on-surface-variant">
                    Choose topics and word types to narrow your library.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeFilterModal}
                  className="h-9 w-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
                  aria-label="Close filter"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    close
                  </span>
                </button>
              </div>
            </div>

            <div className="px-6 py-5 space-y-6 max-h-[420px] overflow-y-auto">
              <div>
                <h3 className="text-[14px] leading-5 font-bold text-on-surface mb-3">
                  Topics
                </h3>

                {topics.length === 0 ? (
                  <p className="text-[14px] text-on-surface-variant">
                    No topics found.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {topics.map((topic) => {
                      const isChecked = draftCategories.includes(topic);

                      return (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => toggleCategory(topic)}
                          className={`rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors ${
                            isChecked
                              ? "bg-primary text-on-primary border-primary"
                              : "bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-container-low"
                          }`}
                        >
                          {topic}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-[14px] leading-5 font-bold text-on-surface mb-3">
                  Word type
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {wordKindOptions.map((wordKind) => {
                    const isChecked = draftWordKinds.includes(wordKind.value);

                    return (
                      <label
                        key={wordKind.value}
                        className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-colors ${
                          isChecked
                            ? "bg-primary-container border-primary-container text-primary"
                            : "bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-container-low"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleWordKind(wordKind.value)}
                          className="h-4 w-4 accent-primary"
                        />

                        <span className="text-[14px] font-medium">
                          {wordKind.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="px-6 py-5 border-t border-outline-variant/70 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
              <button
                type="button"
                onClick={handleClearFilter}
                disabled={isFiltering}
                className="px-5 py-2.5 rounded-xl text-on-surface-variant hover:bg-surface-container-low font-label-md text-label-md transition-colors disabled:opacity-50"
              >
                Clear filter
              </button>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeFilterModal}
                  disabled={isFiltering}
                  className="px-5 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container-low font-label-md text-label-md transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleApplyFilter}
                  disabled={isFiltering}
                  className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isFiltering ? "Filtering..." : "Apply filter"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}