export default function LearningProgress() {
  const progressItems = [
    {
      label: "Reading",
      value: 92,
    },
    {
      label: "Writing",
      value: 78,
    },
    {
      label: "Speaking",
      value: 64,
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-surface-variant shadow-sm overflow-hidden">
      <div className="p-stack-md bg-surface-container-low border-b border-surface-variant">
        <h3 className="font-headline-sm text-headline-sm">
          Learning Progress
        </h3>
      </div>

      <div className="p-stack-md space-y-6">
        {progressItems.map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex justify-between text-label-sm font-label-sm">
              <span>{item.label}</span>
              <span className="text-primary">{item.value}%</span>
            </div>

            <div className="w-full h-2 bg-surface-container-low rounded-full">
              <div
                className="bg-primary h-full rounded-full"
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="p-stack-md border-t border-surface-variant bg-surface-container-lowest">
        <a
          className="text-primary font-label-md text-label-md flex items-center gap-2"
          href="#"
        >
          Full assessment report
          <span className="material-symbols-outlined text-sm">
            arrow_forward
          </span>
        </a>
      </div>
    </div>
  );
}