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
      <div
        className={`rounded-2xl p-5 mb-5 border ${
          isCorrect
            ? "bg-success-container border-success/30"
            : "bg-error-container border-error/30"
        }`}
      >
        <div>

          <div className="flex-1 min-w-0">
            <p className="text-label-md font-bold text-on-surface uppercase tracking-[0.08em]">
              {isCorrect ? "Correct" : "Review answer"}
            </p>

            <p className="mt-2 text-body-sm text-on-surface-variant leading-relaxed">
              {isCorrect
                ? "Nice work. You picked the right answer."
                : `Not quite. The correct answer is "${correctAnswerText}".`}

              {onSpeak && (
                <button
                  type="button"
                  onClick={onSpeak}
                  className="ml-1 inline-flex h-6 w-6 translate-y-[5.5px] items-center justify-center rounded-full text-primary hover:bg-white/70 transition-colors"
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
                className="mt-3 max-h-[96px] overflow-y-auto pr-2 text-[14px] leading-6 text-on-surface-variant"
                dangerouslySetInnerHTML={{
                  __html: marked.parse(explanation),
                }}
              />
            )}
          </div>
        </div>
      </div>

      <div className="pt-5 border-t border-outline-variant/70 flex justify-between items-center">
        <button className="flex items-center gap-2 text-on-surface-variant hover:text-primary font-label-md transition-colors">
          <span className="material-symbols-outlined text-[20px]">flag</span>
          Report
        </button>

        <button
          type="button"
          onClick={onNext}
          className="bg-primary hover:bg-on-primary-container text-white px-7 py-3 rounded-full font-label-md shadow-[0_8px_20px_rgba(66,85,255,0.22)] active:scale-[0.98] transition-all flex items-center gap-2"
        >
          Next question
          <span className="material-symbols-outlined text-[20px]">
            arrow_forward
          </span>
        </button>
      </div>
    </>
  );
}