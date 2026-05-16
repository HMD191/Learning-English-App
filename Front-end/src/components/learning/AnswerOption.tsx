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
    "flex items-center gap-stack-md p-stack-md rounded-lg text-left transition-all border bg-white hover:border-primary-container hover:bg-surface-container-low";

  let labelClass =
    "w-10 h-10 shrink-0 flex items-center justify-center rounded-lg bg-surface-container-high text-on-surface-variant font-bold text-label-md";

  let icon: string | null = null;
  let iconClass = "";

  if (isCorrect) {
    buttonClass =
      "flex items-center gap-stack-md p-stack-md rounded-lg text-left transition-all border-2 bg-[#E8F5E9] border-[#4CAF50] shadow-sm";
    labelClass =
      "w-10 h-10 shrink-0 flex items-center justify-center rounded-lg bg-[#4CAF50] text-white font-bold text-label-md";
    icon = "check_circle";
    iconClass = "text-[#4CAF50]";
  } else if (isWrong) {
    buttonClass =
      "flex items-center gap-stack-md p-stack-md rounded-lg text-left transition-all border-2 bg-[#FFEBEE] border-[#EF5350] shadow-sm";
    labelClass =
      "w-10 h-10 shrink-0 flex items-center justify-center rounded-lg bg-[#EF5350] text-white font-bold text-label-md";
    icon = "cancel";
    iconClass = "text-[#EF5350]";
  } else if (isSelected) {
    buttonClass =
      "flex items-center gap-stack-md p-stack-md rounded-lg text-left transition-all border-2 bg-primary-container/10 border-primary-container shadow-sm";
    labelClass =
      "w-10 h-10 shrink-0 flex items-center justify-center rounded-lg bg-primary text-on-primary font-bold text-label-md";
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={buttonClass}
    >
      <span className={labelClass}>{label}</span>

      <div className="flex-grow">
        <p className="text-body-md font-semibold text-on-surface">{option}</p>
      </div>

      {icon && (
        <span className={`material-symbols-outlined ${iconClass}`}>
          {icon}
        </span>
      )}
    </button>
  );
}