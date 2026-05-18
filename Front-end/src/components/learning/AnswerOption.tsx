type AnswerOptionProps = {
  label: string;
  option: string;
  isSelected: boolean;
  isCorrect: boolean;
  isWrong: boolean;
  disabled: boolean;
  onClick: () => void;
};

export default function AnswerOption({
  label,
  option,
  isSelected,
  isCorrect,
  isWrong,
  disabled,
  onClick,
}: AnswerOptionProps) {
  let buttonClass =
    "group flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all border bg-white border-outline-variant/70 hover:border-primary/30 hover:bg-primary-container/20 disabled:cursor-default";

  let labelClass =
    "w-12 h-12 shrink-0 flex items-center justify-center rounded-2xl bg-surface-container-low text-on-surface-variant font-semibold text-[18px] transition-colors";

  let icon: string | null = null;
  let iconClass = "";

  if (isCorrect) {
    buttonClass =
      "group flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all border bg-[#eef9f1] border-[#8fd3a7] shadow-none disabled:cursor-default";
    labelClass =
      "w-12 h-12 shrink-0 flex items-center justify-center rounded-2xl bg-[#cfeedd] text-[#1f8a55] font-semibold text-[18px]";

  } else if (isWrong) {
    buttonClass =
      "group flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all border bg-[#fff2f0] border-[#f2aaa2] shadow-none disabled:cursor-default";
    labelClass =
      "w-12 h-12 shrink-0 flex items-center justify-center rounded-2xl bg-[#ffd9d4] text-[#d05c50] font-semibold text-[18px]";

  } else if (isSelected) {
    buttonClass =
      "group flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all border bg-[#eef1ff] border-[#b8c2ff] shadow-none disabled:cursor-default";
    labelClass =
      "w-12 h-12 shrink-0 flex items-center justify-center rounded-2xl bg-[#dce1ff] text-primary font-semibold text-[18px]";
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={buttonClass}
    >
      {/* <span className={labelClass}> */}
        {isCorrect ? (
          <img
            src="/image/like.png"
            alt="Correct"
            className="h-12 w-12 object-contain shrink-0"
          />
        ) : isWrong ? (
          <img
            src="/image/wrong.png"
            alt="Wrong"
            className="h-12 w-12 object-contain shrink-0"
          />
        ) : (
          <span className={labelClass}>{label}</span>
        )}
      {/* </span> */}

      <div className="flex-grow min-w-0">
        <p className="text-[15px] leading-6 font-medium text-on-surface">
          {option}
        </p>
      </div>

      {icon && (
        <span className={`material-symbols-outlined text-[24px] ${iconClass}`}>
          {icon}
        </span>
      )}
    </button>
  );
}