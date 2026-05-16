import AnswerOption from "./AnswerOption";
import ResultPanel from "./ResultPanel";
import {
  LETTERS,
  LearningMode,
  modeDescriptions,
  modeInstructions,
  QuestionData,
} from "./types";

type QuizCardProps = {
  data: QuestionData;
  mode: LearningMode;
  selected: number | null;
  showResult: boolean;
  userAnswer: string[];
  activeIndices: number[];
  questionNumber: number;
  totalQuestions: number;
  onChoose: (index: number) => void;
  onNext: () => void;
  onSpeak: (text: string) => void;
};

export default function QuizCard({
  data,
  mode,
  selected,
  showResult,
  userAnswer,
  activeIndices,
  questionNumber,
  totalQuestions,
  onChoose,
  onNext,
  onSpeak,
}: QuizCardProps) {
  const isCompleteWordMode = mode === "complete-word";

  const progressPercent = Math.min(
    100,
    Math.round((questionNumber / totalQuestions) * 100)
  );

  const correctIndex = LETTERS.indexOf(data.rightAnswer);
  const selectedLetter = selected !== null ? LETTERS[selected] : null;

  const isMultipleChoiceCorrect =
    selectedLetter !== null && selectedLetter === data.rightAnswer;

  const assembledWord = userAnswer.join("");
  const isCompleteWordCorrect = assembledWord === data.rightAnswer;

  const isCorrect = isCompleteWordMode
    ? isCompleteWordCorrect
    : isMultipleChoiceCorrect;

  const correctAnswerText = isCompleteWordMode
    ? data.rightAnswer
    : data.answerOptions[correctIndex];

  function getQuestionTitle() {
    if (mode === "1Eng-4Vn-words") {
      return data.sentence;
    }

    if (mode === "1Vn-4Eng-words") {
      return data.sentence;
    }

    return data.sentence.replace("____", "____");
  }

  return (
    <div className="w-full max-w-4xl bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden p-stack-lg md:p-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-stack-lg gap-stack-md">
        <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-label-sm">
          {modeDescriptions[mode]}
        </span>

        <div className="flex items-center gap-2">
          <div className="w-48 h-2 bg-surface-container rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-container"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-label-sm text-on-surface-variant">
            {questionNumber}/{totalQuestions}
          </span>
        </div>
      </div>

      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-4 mb-stack-sm">
          <h2 className="text-display-lg font-display-lg text-on-surface">
            {getQuestionTitle()}
          </h2>

          {(mode === "1Eng-4Vn-words" ||
            mode === "complete-sentence-meaning") && (
            <button
              type="button"
              onClick={() => onSpeak(data.sentence)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-container/20 text-primary hover:bg-primary-container/30 transition-colors"
              aria-label="Listen"
            >
              <span className="material-symbols-outlined">volume_up</span>
            </button>
          )}
        </div>

        <p className="text-body-lg text-on-surface-variant italic">
          {modeInstructions[mode]}
        </p>

        {isCompleteWordMode && (
          <div className="mt-stack-lg">
            <div
              className={`inline-flex min-h-[56px] min-w-[220px] items-center justify-center rounded-xl border-2 px-6 text-headline-md font-bold tracking-[0.25em] ${
                showResult
                  ? isCompleteWordCorrect
                    ? "bg-[#E8F5E9] border-[#4CAF50] text-[#2E7D32]"
                    : "bg-[#FFEBEE] border-[#EF5350] text-[#C62828]"
                  : "bg-surface-container-low border-outline-variant text-on-surface"
              }`}
            >
              {assembledWord || "_____"}
            </div>
          </div>
        )}
      </div>

      {isCompleteWordMode ? (
        <div className="flex flex-wrap justify-center gap-stack-md mb-stack-lg">
          {data.answerOptions.map((option, index) => {
            const isActive = activeIndices.includes(index);

            return (
              <button
                key={`${option}-${index}`}
                type="button"
                onClick={() => onChoose(index)}
                disabled={showResult}
                className={`w-14 h-14 rounded-xl border text-headline-sm font-bold transition-all ${
                  isActive
                    ? "bg-primary text-on-primary border-primary shadow-sm"
                    : "bg-white border-outline-variant text-on-surface hover:border-primary-container hover:bg-surface-container-low"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md mb-stack-lg">
          {data.answerOptions.map((option, index) => {
            const isChosen = selected === index;
            const isAnswerCorrect = showResult && index === correctIndex;
            const isWrong = showResult && isChosen && index !== correctIndex;

            return (
              <AnswerOption
                key={`${option}-${index}`}
                label={LETTERS[index].toUpperCase()}
                option={option}
                isSelected={isChosen}
                isCorrect={isAnswerCorrect}
                isWrong={isWrong}
                disabled={showResult}
                onClick={() => onChoose(index)}
              />
            );
          })}
        </div>
      )}

      {showResult && (
        <ResultPanel
          isCorrect={isCorrect}
          correctAnswerText={correctAnswerText}
          explanation={data.explanation}
          onNext={onNext}
          onSpeak={
            isCompleteWordMode
              ? () => onSpeak(data.rightAnswer)
              : undefined
          }
        />
      )}
    </div>
  );
}