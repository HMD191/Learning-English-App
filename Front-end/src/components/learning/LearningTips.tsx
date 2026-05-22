export default function LearningTips() {
  return (
    <div className="hidden md:grid w-full max-w-5xl mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white p-5 rounded-2xl border border-outline-variant/70 shadow-[0_2px_12px_rgba(31,41,55,0.04)] flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary-container flex items-center justify-center text-primary">
          <span className="material-symbols-outlined">lightbulb</span>
        </div>

        <div>
          <h4 className="text-label-md font-bold text-on-surface">
            Study tip
          </h4>
          <p className="mt-1 text-body-sm text-on-surface-variant">
            Say the word out loud after each question to make it easier to remember.
          </p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-outline-variant/70 shadow-[0_2px_12px_rgba(31,41,55,0.04)] flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary">
          <span className="material-symbols-outlined">trending_up</span>
        </div>

        <div>
          <h4 className="text-label-md font-bold text-on-surface">
            Keep your streak
          </h4>
          <p className="mt-1 text-body-sm text-on-surface-variant">
            A few focused questions every day beats one long study session.
          </p>
        </div>
      </div>
    </div>
  );
}