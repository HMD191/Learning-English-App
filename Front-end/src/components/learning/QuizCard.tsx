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
  <div className="w-full max-w-4xl bg-white border border-outline-variant/70 rounded-3xl shadow-[0_8px_24px_rgba(31,41,55,0.05)] overflow-hidden">
    <div className="p-5 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-7 gap-4">
          <div>
            {/* <span className="inline-flex items-center rounded-full bg-primary-container px-3 py-1 text-label-sm font-bold text-primary">
              {modeDescriptions[mode]}
            </span> */}

            <p className="mt-2 text-body-sm text-on-surface-variant">
              Question {questionNumber} of {totalQuestions}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="h-2 flex-1 md:w-56 bg-surface-container rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <span className="text-label-sm font-bold text-on-surface-variant">
              {progressPercent}%
            </span>
          </div>
        </div>

        <div className="text-center mb-5">
          <div className="flex items-center justify-center gap-3 mb-3">
            <h2 className="max-w-3xl text-[22px] leading-[30px] md:text-[26px] md:leading-[34px] font-bold tracking-[-0.025em] text-on-surface">
              {getQuestionTitle()}
            </h2>

            {(mode === "1Eng-4Vn-words" ||
              mode === "complete-sentence-meaning") && (
              <button
                type="button"
                onClick={() => onSpeak(data.sentence)}
                className="w-11 h-11 flex items-center justify-center rounded-full bg-primary-container text-primary hover:bg-primary-fixed-dim transition-colors"
                aria-label="Listen"
              >
                <span className="material-symbols-outlined">volume_up</span>
              </button>
            )}
          </div>

          <p className="text-[15px] leading-6 text-on-surface-variant">
            {modeInstructions[mode]}
          </p>

          {isCompleteWordMode && (
            <div className="mt-8">
              <div
                className={`inline-flex min-h-[64px] min-w-[260px] items-center justify-center rounded-2xl border-2 px-7 text-headline-md font-bold tracking-[0.25em] transition-all ${
                  showResult
                    ? isCompleteWordCorrect
                      ? "bg-success-container border-success text-on-success-container"
                      : "bg-error-container border-error text-on-error-container"
                    : "bg-surface-container-low border-outline-variant text-on-surface"
                }`}
              >
                {assembledWord || "_____"}
              </div>
            </div>
          )}
        </div>

        {isCompleteWordMode ? (
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {data.answerOptions.map((option, index) => {
              const isActive = activeIndices.includes(index);

              return (
                <button
                  key={`${option}-${index}`}
                  type="button"
                  onClick={() => onChoose(index)}
                  disabled={showResult}
                  className={`w-14 h-14 rounded-2xl border text-headline-sm font-bold transition-all disabled:cursor-default ${
                    isActive
                      ? "bg-primary text-on-primary border-primary shadow-[0_8px_20px_rgba(66,85,255,0.2)]"
                      : "bg-white border-outline-variant text-on-surface hover:border-primary hover:bg-primary-container"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
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
    </div>
  );
}