export default function UpdateNotice() {
  return (
    <section className="rounded-3xl border border-outline-variant bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary-container px-3 py-1 text-sm font-bold text-primary">
            <span className="material-symbols-outlined text-[18px]">
              campaign
            </span>
            New update
          </div>

          {/* <h2 className="text-2xl font-bold tracking-[-0.03em] text-on-surface">
            Learning setup is now available
          </h2> */}

          <h2 className="text-2xl font-bold tracking-[-0.03em] text-on-surface">
            You can now choose one or multiple topics, select all topics, and
            pick a difficulty level before starting your English practice.
          </h2>
        </div>

        <div className="rounded-2xl bg-surface-container-low px-4 py-3 text-sm font-bold text-on-surface-variant">
          v1.2.0
        </div>
      </div>

      {/* <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-surface-container-low p-4">
          <p className="font-bold text-on-surface">Multiple topics</p>
          <p className="mt-1 text-sm text-on-surface-variant">
            Choose all topics or select specific topics you want to practice.
          </p>
        </div>

        <div className="rounded-2xl bg-surface-container-low p-4">
          <p className="font-bold text-on-surface">IELTS-based levels</p>
          <p className="mt-1 text-sm text-on-surface-variant">
            Difficulty levels now include IELTS band descriptions.
          </p>
        </div>

        <div className="rounded-2xl bg-surface-container-low p-4">
          <p className="font-bold text-on-surface">Smarter practice</p>
          <p className="mt-1 text-sm text-on-surface-variant">
            Questions are loaded based on your selected topics and difficulty.
          </p>
        </div>
      </div> */}
    </section>
  );
}