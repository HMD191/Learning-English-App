export default function LearningQueue() {
  const lessons = [
    {
      type: "Grammar",
      title: "Passive Voice Mastery",
      description: "Mastering complex sentence structures in academic writing.",
      time: "20 mins",
      progress: "65%",
      badgeClass: "bg-secondary-container text-on-secondary-container",
    },
    {
      type: "Listening",
      title: "The Art of Debating",
      description: "Analyzing nuances in argumentative English speeches.",
      time: "15 mins",
      progress: "10%",
      badgeClass: "bg-surface-container-highest text-on-surface-variant",
    },
  ];

  return (
    <div className="space-y-gutter">
      <div className="flex items-center justify-between">
        <h3 className="font-headline-sm text-headline-sm text-on-surface">
          Up Next
        </h3>

        <button className="text-primary font-label-md text-label-md border-b border-primary/30 hover:border-primary transition-all">
          View Schedule
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-stack-md">
        {lessons.map((lesson) => (
          <div
            key={lesson.title}
            className="bg-white p-stack-md rounded-xl border border-surface-variant shadow-sm hover:translate-y-[-4px] transition-transform cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${lesson.badgeClass}`}
              >
                {lesson.type}
              </span>

              <span className="text-on-surface-variant text-xs">
                {lesson.time}
              </span>
            </div>

            <h4 className="font-headline-sm text-headline-sm mb-2">
              {lesson.title}
            </h4>

            <p className="text-body-sm text-on-surface-variant mb-4">
              {lesson.description}
            </p>

            <div className="w-full bg-surface-container-low h-1 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full"
                style={{ width: lesson.progress }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}