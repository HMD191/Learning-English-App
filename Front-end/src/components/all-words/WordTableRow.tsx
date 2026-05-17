import { Word, wordTypes } from "./types";

type WordTableRowProps = {
  index: number;
  word: Word;
  topics: string[];
  isEditing: boolean;
  editedWord: Word | null;
  onEdit: (word: Word) => void;
  onSave: () => void;
  onDelete: (english: string) => void;
  onSpeak: (text: string) => void;
  onEditedWordChange: (field: keyof Word, value: string) => void;
  onToggleType: (typeValue: string) => void;
  onOpenCreateTopic: () => void;
};

export default function WordTableRow({
  index,
  word,
  topics,
  isEditing,
  editedWord,
  onEdit,
  onSave,
  onDelete,
  onSpeak,
  onEditedWordChange,
  onToggleType,
  onOpenCreateTopic,
}: WordTableRowProps) {
  const selectedTypes = editedWord?.type
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <tr className="hover:bg-surface-container/50 transition-colors group">
      <td className="px-6 py-5 text-body-sm text-on-surface-variant">
        {index + 1}
      </td>

      <td className="px-4 py-3">
        {isEditing ? (
          <input
            value={editedWord?.english || ""}
            onChange={(event) =>
              onEditedWordChange("english", event.target.value)
            }
            className="w-full h-[40px] bg-surface-container-low border border-outline-variant rounded-lg px-3 text-body-sm form-input-focus"
          />
        ) : (
          <span className="text-[14px] leading-5 font-normal text-on-surface">
            {word.english}
          </span>
        )}
      </td>

      <td className="px-4 py-3">
        {isEditing ? (
          <div className="flex flex-wrap gap-2">
            {wordTypes.map((type) => (
              <label
                key={type.value}
                className={`px-3 py-1 rounded-full border text-label-sm cursor-pointer transition-colors ${
                  selectedTypes?.includes(type.value)
                    ? "bg-primary text-on-primary border-primary"
                    : "bg-surface-container-low text-on-surface-variant border-outline-variant"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedTypes?.includes(type.value) || false}
                  onChange={() => onToggleType(type.value)}
                  className="sr-only"
                />
                {type.label}
              </label>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-1">
            {word.type
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
              .map((type) => (
                <span
                  key={type}
                  className="bg-secondary-container/50 text-on-secondary-container px-2 py-1 rounded text-label-sm font-medium"
                >
                  {type}
                </span>
              ))}
          </div>
        )}
      </td>

      <td className="px-4 py-3">
        {isEditing ? (
          <input
            value={editedWord?.synonyms || ""}
            onChange={(event) =>
              onEditedWordChange("synonyms", event.target.value)
            }
            className="w-full h-[40px] bg-surface-container-low border border-outline-variant rounded-lg px-3 text-body-sm form-input-focus"
          />
        ) : (
          <p className="text-body-sm text-on-surface-variant max-w-[180px] truncate">
            {word.synonyms || "N/A"}
          </p>
        )}
      </td>

      <td className="px-4 py-3">
        {isEditing ? (
          <input
            value={editedWord?.vietnamese || ""}
            onChange={(event) =>
              onEditedWordChange("vietnamese", event.target.value)
            }
            className="w-full h-[40px] bg-surface-container-low border border-outline-variant rounded-lg px-3 text-body-sm form-input-focus"
          />
        ) : (
          <p className="text-body-sm text-on-surface-variant max-w-xs truncate lg:max-w-md">
            {word.vietnamese}
          </p>
        )}
      </td>

      <td className="px-4 py-3">
        {isEditing ? (
          <div className="space-y-1">
            <div className="relative">
              <select
                value={editedWord?.category || ""}
                onChange={(event) =>
                  onEditedWordChange("category", event.target.value)
                }
                className="w-full h-[40px] appearance-none bg-surface-container-low border border-outline-variant rounded-lg px-3 pr-9 text-body-sm form-input-focus cursor-pointer"
              >
                <option value="">Select Topic</option>

                {topics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>

              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-outline">
                arrow_drop_down
              </span>
            </div>

            <button
              type="button"
              onClick={onOpenCreateTopic}
              className="text-[10px] text-primary hover:underline whitespace-nowrap"
            >
              Create Topic
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-on-surface-variant text-label-md">
            <span className="w-2 h-2 rounded-full bg-primary-container" />
            {word.category || "N/A"}
          </div>
        )}
      </td>

      <td className="px-4 py-3 ">
        <div className="flex items-center justify-center gap-1">
          <button
            type="button"
            onClick={() => onSpeak(word.english)}
            className="p-2 text-outline hover:text-primary transition-colors"
            aria-label="Listen"
          >
            <span className="material-symbols-outlined text-[18px]">
              volume_up
            </span>
          </button>

          {isEditing ? (
            <button
              type="button"
              onClick={onSave}
              className="p-2 text-outline hover:text-primary transition-colors"
              aria-label="Save"
            >
              <span className="material-symbols-outlined text-[18px]">
                save
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onEdit(word)}
              className="p-2 text-outline hover:text-primary transition-colors"
              aria-label="Edit"
            >
              <span className="material-symbols-outlined text-[18px]">
                edit
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onDelete(word.english)}
            className="p-2 text-outline hover:text-error transition-colors"
            aria-label="Delete"
          >
            <span className="material-symbols-outlined text-[18px]">
              delete
            </span>
          </button>
        </div>
      </td>
    </tr>
  );
}