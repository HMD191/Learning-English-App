import { Word } from "./types";
import WordTableRow from "./WordTableRow";

type WordsTableProps = {
  words: Word[];
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
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1120px] text-left border-collapse">
        <thead>
          <tr className="bg-surface-container-low border-b border-outline-variant">
            <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              #
            </th>
            <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              English
            </th>
            <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              Synonyms
            </th>
            <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              Vietnamese
            </th>
            <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              Topic
            </th>
            <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-outline-variant/20">
          {isLoading ? (
            <tr>
              <td
                colSpan={7}
                className="px-6 py-12 text-center text-body-md text-on-surface-variant"
              >
                Loading words...
              </td>
            </tr>
          ) : words.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="px-6 py-12 text-center text-body-md text-on-surface-variant"
              >
                No words found.
              </td>
            </tr>
          ) : (
            words.map((word, index) => (
              <WordTableRow
                key={`${word.english}-${index}`}
                index={index}
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