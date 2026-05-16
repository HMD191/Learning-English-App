import { marked } from "marked";

type ResultPanelProps = {
  isCorrect: boolean;
  correctAnswerText: string;
  explanation?: string;
  onNext: () => void;
  onSpeak?: () => void;
};

export default function ResultPanel({
  isCorrect,
  correctAnswerText,
  explanation,
  onNext,
  onSpeak,
}: ResultPanelProps) {
  return (
    <>
      <div className="bg-surface-container border-l-4 border-primary-container p-stack-md rounded-r-lg mb-10">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-primary mt-1">
            info
          </span>

          <div className="flex-1">
            <p className="text-label-md font-bold text-on-surface mb-1 uppercase tracking-wider">
              {isCorrect ? "Correct" : "Review Answer"}
            </p>

            <div className="text-body-sm text-on-surface-variant leading-relaxed">
              <p className="mb-2">
                {isCorrect
                  ? "Great job! You selected the correct answer."
                  : `Not quite. The correct answer is "${correctAnswerText}".`}
                {onSpeak && (
                  <button
                    type="button"
                    onClick={onSpeak}
                    className="ml-2 text-primary hover:opacity-80"
                    aria-label="Listen"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      volume_up
                    </span>
                  </button>
                )}
              </p>

              {explanation && (
                <div
                  className="prose prose-sm max-w-none text-on-surface-variant"
                  dangerouslySetInnerHTML={{
                    __html: marked.parse(explanation),
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-stack-lg border-t border-outline-variant">
        <button className="flex items-center gap-2 text-on-surface-variant hover:text-primary font-label-md transition-colors">
          <span className="material-symbols-outlined">flag</span>
          Report Issue
        </button>

        <button
          type="button"
          onClick={onNext}
          className="bg-[#7C5CFC] hover:bg-primary text-white px-8 py-3 rounded-lg font-label-md shadow-md active:scale-95 transition-all flex items-center gap-2"
        >
          Next Question
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </>
  );
}