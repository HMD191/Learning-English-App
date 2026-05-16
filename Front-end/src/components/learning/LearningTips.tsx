export default function LearningTips() {
  return (
    <div className="w-full max-w-4xl mt-stack-lg flex flex-col md:flex-row gap-gutter">
      <div className="flex-1 bg-white p-6 rounded-xl border border-outline-variant shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-primary">
          <span className="material-symbols-outlined">lightbulb</span>
        </div>

        <div>
          <h4 className="text-label-md font-bold text-on-surface">
            Daily Tip
          </h4>
          <p className="text-body-sm text-on-surface-variant">
            Try using today&apos;s word in a sentence to strengthen your memory.
          </p>
        </div>
      </div>

      <div className="flex-1 bg-white p-6 rounded-xl border border-outline-variant shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary">
          <span className="material-symbols-outlined">trending_up</span>
        </div>

        <div>
          <h4 className="text-label-md font-bold text-on-surface">
            Your Progress
          </h4>
          <p className="text-body-sm text-on-surface-variant">
            You&apos;re on a 5-day streak. Keep going to unlock new badges.
          </p>
        </div>
      </div>
    </div>
  );
}