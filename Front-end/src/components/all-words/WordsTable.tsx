import { Word } from "./types";
import WordTableRow from "./WordTableRow";

type WordsTableProps = {
  words: Word[];
  startIndex: number;
  topics: string[];
  isLoading: boolean;
  originalEnglish: string | null;
  editedWord: Word | null;
  onEdit: (word: Word) => void;
  onSave: () => void;
  onDelete: (english: string) => void;
  onSpeak: (text: string) => void;
  onEditedWordChange: (field: keyof Word, value: string) => void;
  onToggleType: (typeValue: string) => void;
  onOpenCreateTopic: () => void;
};

export default function WordsTable({
  words,
  startIndex,
  topics,
  isLoading,
  originalEnglish,
  editedWord,
  onEdit,
  onSave,
  onDelete,
  onSpeak,
  onEditedWordChange,
  onToggleType,
  onOpenCreateTopic,
}: WordsTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[860px] text-left border-collapse">
        <thead>
          <tr className="bg-surface-container-low border-b border-outline-variant/70">
            <th className="px-4 py-3 text-[12px] leading-4 font-semibold text-on-surface-variant/70">
              #
            </th>

            <th className="px-4 py-3 text-[12px] leading-4 font-semibold text-on-surface-variant/70">
              English
            </th>

            <th className="px-4 py-3 text-[12px] leading-4 font-semibold text-on-surface-variant/70">
              Type
            </th>

            <th className="px-4 py-3 text-[12px] leading-4 font-semibold text-on-surface-variant/70">
              Synonyms
            </th>

            <th className="px-4 py-3 text-[12px] leading-4 font-semibold text-on-surface-variant/70">
              Vietnamese
            </th>

            <th className="px-4 py-3 text-[12px] leading-4 font-semibold text-on-surface-variant/70">
              Topic
            </th>

            <th className="px-4 py-3 text-[12px] leading-4 font-semibold text-on-surface-variant/70 text-center">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-outline-variant/30">
          {isLoading ? (
            <tr>
              <td
                colSpan={7}
                className="px-4 py-10 text-center text-[14px] text-on-surface-variant"
              >
                Loading words...
              </td>
            </tr>
          ) : words.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="px-4 py-10 text-center text-[14px] text-on-surface-variant"
              >
                No words found.
              </td>
            </tr>
          ) : (
            words.map((word, index) => (
              <WordTableRow
                key={`${word.english}-${startIndex + index}`}
                index={startIndex + index}
                word={word}
                topics={topics}
                isEditing={originalEnglish === word.english}
                editedWord={editedWord}
                onEdit={onEdit}
                onSave={onSave}
                onDelete={onDelete}
                onSpeak={onSpeak}
                onEditedWordChange={onEditedWordChange}
                onToggleType={onToggleType}
                onOpenCreateTopic={onOpenCreateTopic}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}