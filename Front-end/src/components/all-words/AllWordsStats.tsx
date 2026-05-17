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
      label: "total words",
      value: totalWords.toLocaleString(),
    },
    {
      label: "topics",
      value: totalTopics.toLocaleString(),
    },
    {
      label: "added this week",
      value: "42",
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 text-[14px] leading-5 text-on-surface-variant">
      {stats.map((stat, index) => (
        <div key={stat.label} className="flex items-center gap-2">
          {index > 0 && (
            <span className="h-1 w-1 rounded-full bg-outline-variant" />
          )}

          <span className="font-bold text-on-surface">{stat.value}</span>
          <span>{stat.label}</span>
        </div>
      ))}
    </div>
  );
}