export default function WeeklyGoalPanel() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
      <div className="lg:col-span-8 bg-surface-container-high rounded-xl p-8 relative overflow-hidden flex flex-col justify-center min-h-[240px]">
        <div className="relative z-10 max-w-md">
          <h3 className="font-headline-md text-headline-md text-on-surface-variant font-bold mb-2">
            Weekly Goal Progress
          </h3>

          <p className="text-body-md text-on-surface-variant mb-6">
            You&apos;re only 8 words away from your weekly target. Keep pushing!
          </p>

          <div className="w-full bg-white/50 rounded-full h-3 mb-2">
            <div className="bg-primary h-full rounded-full w-[78%]" />
          </div>

          <div className="flex justify-between text-label-sm text-on-surface-variant">
            <span>42/50 Words</span>
            <span>78%</span>
          </div>
        </div>

        <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent flex items-center justify-center opacity-40 pointer-events-none">
          <span className="material-symbols-outlined !text-[160px] text-primary">
            school
          </span>
        </div>
      </div>

      <div className="lg:col-span-4 bg-primary text-on-primary rounded-xl p-8 flex flex-col justify-between">
        <div>
          <h3 className="font-headline-sm text-headline-sm font-bold mb-2">
            Review Mode
          </h3>

          <p className="text-label-md opacity-90">
            Quick session: 15 words from your Needs Practice list.
          </p>
        </div>

        <button className="mt-6 w-full py-4 bg-white text-primary font-bold rounded-xl hover:bg-secondary-fixed transition-colors">
          Start Now
        </button>
      </div>
    </section>
  );
}