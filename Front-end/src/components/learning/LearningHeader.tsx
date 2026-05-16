export default function LearningHeader() {
  return (
    <div className="w-full max-w-4xl">
      <nav className="flex items-center gap-2 mb-stack-lg text-label-sm text-on-surface-variant">
        <span>Learning</span>
        <span className="material-symbols-outlined text-[14px]">
          chevron_right
        </span>
        <span className="text-primary font-semibold">Daily Quiz</span>
      </nav>

      {/* <div className="mb-stack-lg">
        <h1 className="font-display-lg text-[56px] leading-[64px] font-bold text-primary tracking-[-0.03em]">
          Learning Mode
        </h1>

        <p className="text-body-md text-on-surface-variant mt-2">
          Practice vocabulary through adaptive question types.
        </p>
      </div> */}
    </div>
  );
}