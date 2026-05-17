export default function WeeklyGoalPanel() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-8 bg-white rounded-2xl border border-outline-variant/70 p-5 relative overflow-hidden flex flex-col justify-center min-h-[150px] shadow-[0_2px_10px_rgba(31,41,55,0.04)]">
        <div className="relative z-10 max-w-md">
          <h3 className="text-[18px] leading-6 font-bold text-on-surface mb-1">
            Weekly Goal Progress
          </h3>

          <p className="text-[14px] leading-5 text-on-surface-variant mb-4">
            You&apos;re only 8 words away from your weekly target.
          </p>

          <div className="w-full bg-surface-container-low rounded-full h-2 mb-2">
            <div className="bg-primary h-full rounded-full w-[78%]" />
          </div>

          <div className="flex justify-between text-[12px] font-semibold text-on-surface-variant">
            <span>42/50 Words</span>
            <span>78%</span>
          </div>
        </div>

        <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-primary-container/60 to-transparent flex items-center justify-center opacity-50 pointer-events-none">
          <span className="material-symbols-outlined !text-[92px] text-primary">
            school
          </span>
        </div>
      </div>

      <div className="lg:col-span-4 bg-primary text-on-primary rounded-2xl p-5 flex flex-col justify-between min-h-[150px] shadow-[0_8px_20px_rgba(66,85,255,0.16)]">
        <div>
          <h3 className="text-[18px] leading-6 font-bold mb-1">
            Review Mode
          </h3>

          <p className="text-[14px] leading-5 opacity-90">
            Practice 15 words from your Needs Practice list.
          </p>
        </div>

        <button className="mt-4 w-full py-2.5 bg-white text-primary font-bold rounded-xl hover:bg-primary-container transition-colors">
          Start Now
        </button>
      </div>
    </section>
  );
}