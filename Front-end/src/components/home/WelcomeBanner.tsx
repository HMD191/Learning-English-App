import Link from "next/link";
export default function WelcomeBanner() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
      <div className="lg:col-span-8 bg-white p-stack-lg rounded-xl shadow-sm border border-surface-variant relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">
            Welcome back, Inzy!
          </h2>

          <p className="font-body-md text-body-md text-on-surface-variant max-w-md mb-6">
            You&apos;ve mastered 12 new words this week. Keep the momentum
            going and reach your daily goal of 20 words.
          </p>

          <Link
            href="/learning"
            className="inline-flex bg-primary-container text-on-primary-container px-6 py-3 rounded-lg font-label-md text-label-md items-center gap-2 hover:shadow-lg transition-shadow"
          >
            <span className="material-symbols-outlined">play_circle</span>
            Start Lesson
          </Link>
        </div>

        <div className="absolute right-0 bottom-0 w-1/3 h-full opacity-20 pointer-events-none bg-gradient-to-l from-primary-container to-transparent" />

        <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] text-primary-container/20 rotate-12">
          auto_stories
        </span>
      </div>

      <div className="lg:col-span-4 bg-primary text-on-primary p-stack-lg rounded-xl shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="font-headline-sm text-headline-sm mb-1">
            Daily Stressssss
          </h3>
          <p className="text-primary-fixed text-sm">You are on fire!</p>
        </div>

        <div className="flex items-center justify-center py-4">
          <span className="text-6xl font-bold">14</span>
          <span
            className="material-symbols-outlined text-4xl ml-2 text-primary-fixed-dim"
            style={{ fontVariationSettings: '"FILL" 1' }}
          >
            local_fire_department
          </span>
        </div>

        <p className="text-center font-label-sm text-label-sm">
          3 days to next milestone
        </p>
      </div>
    </section>
  );
}