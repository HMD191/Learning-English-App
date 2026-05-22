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

  const normalizeAnswer = (text: string) => text.trim().toLowerCase();

  function getCorrectIndex() {
    const normalizedRightAnswer = normalizeAnswer(data.rightAnswer);

    const letterIndex = LETTERS.findIndex(
      (letter) => normalizeAnswer(letter) === normalizedRightAnswer
    );

    if (letterIndex !== -1) {
      return letterIndex;
    }

    return data.answerOptions.findIndex(
      (option) => normalizeAnswer(option) === normalizedRightAnswer
    );
  }

  const correctIndex = getCorrectIndex();

  const isMultipleChoiceCorrect =
    selected !== null && selected === correctIndex;

  const assembledWord = userAnswer.join("");
  const isCompleteWordCorrect = assembledWord === data.rightAnswer;

  const isCorrect = isCompleteWordMode
    ? isCompleteWordCorrect
    : isMultipleChoiceCorrect;

  const correctAnswerText = isCompleteWordMode
    ? data.rightAnswer
    : data.answerOptions[correctIndex] || data.rightAnswer;

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
    // <div className="w-full max-w-4xl bg-white border border-outline-variant/70 rounded-3xl shadow-[0_8px_24px_rgba(31,41,55,0.05)] overflow-hidden">
    <div className="w-full max-w-4xl bg-white border border-outline-variant/70 rounded-2xl md:rounded-3xl shadow-[0_8px_24px_rgba(31,41,55,0.05)] overflow-hidden">
      <div className="p-4 md:p-6">
        {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-7 gap-4"> */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-7 gap-2 md:gap-4">
          <div>
            <p className="-mt-1 text-[11px] md:text-[13px] leading-4 md:leading-5 text-on-surface-variant/80">
              Question {questionNumber} of {totalQuestions}
            </p>

            <p className="mt-1  text-[12px]  text-body-sm font-semibold text-on-surface-variant">
              {modeInstructions[mode]}
            </p>
          </div>

          <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
            <div className="h-1 md:h-2 flex-1 md:w-56 bg-surface-container rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <span className="text-[11px] md:text-label-sm font-bold text-on-surface-variant">
              {progressPercent}%
            </span>
          </div>
        </div>

        <div className="text-center mb-3 md:mb-5">
          <div className="mb-2 md:mb-3">
            {/* <h2 className="text-left text-[20px] leading-[28px] md:text-[24px] md:leading-[32px] font-semibold tracking-[-0.02em] text-on-surface"> */}
            <h2 className="text-left text-[16px] leading-[19px] md:text-[24px] md:leading-[32px] font-semibold tracking-[-0.01em] text-on-surface">
              {getQuestionTitle()}
            </h2>
          </div>

          {/* <p className="text-[15px] leading-6 text-on-surface-variant">
            {modeInstructions[mode]}
          </p> */}

          {isCompleteWordMode && (
            <div className="mt-4 md:mt-8">
              <div
                className={`inline-flex min-h-[44px] md:min-h-[64px] min-w-[220px] md:min-w-[260px] items-center justify-center rounded-xl md:rounded-2xl border-2 px-5 md:px-7 text-[18px] md:text-headline-md font-bold tracking-[0.25em] transition-all ${showResult
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
          <div className="grid grid-cols-6 justify-items-center gap-2 md:flex md:flex-wrap md:justify-center md:gap-3 mb-4 md:mb-8">
            {data.answerOptions.map((option, index) => {
              const isActive = activeIndices.includes(index);

              return (
                <button
                  key={`${option}-${index}`}
                  type="button"
                  onClick={() => onChoose(index)}
                  disabled={showResult}
                  className={`w-9 h-9 md:w-14 md:h-14 rounded-xl md:rounded-2xl border text-[14px] md:text-headline-sm font-bold transition-all disabled:cursor-default ${isActive
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
          <div className="grid grid-cols-2 gap-2 md:gap-3 mb-3 md:mb-5">            {data.answerOptions.map((option, index) => {
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