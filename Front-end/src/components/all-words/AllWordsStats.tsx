type AllWordsStatsProps = {
  totalWords: number;
  totalTopics: number;
};

export default function AllWordsStats({
  totalWords,
  totalTopics,
}: AllWordsStatsProps) {
  const stats = [
    {
      label: "Total Words",
      value: totalWords.toLocaleString(),
      icon: "dictionary",
      iconClass: "bg-primary/10 text-primary",
    },
    {
      label: "Topics",
      value: totalTopics.toLocaleString(),
      icon: "category",
      iconClass: "bg-secondary-container/50 text-on-secondary-container",
    },
    {
      label: "New This Week",
      value: "42",
      icon: "bolt",
      iconClass: "bg-primary-container/20 text-on-primary-container",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/30 flex items-center gap-4"
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.iconClass}`}
          >
            <span className="material-symbols-outlined">
              {stat.icon}
            </span>
          </div>

          <div>
            <div className="text-headline-sm font-bold text-on-surface">
              {stat.value}
            </div>
            <div className="text-label-sm text-outline uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}