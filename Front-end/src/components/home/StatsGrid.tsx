export default function StatsGrid() {
  const stats = [
    {
      label: "Words Learned",
      value: "1,248",
      icon: "menu_book",
    },
    {
      label: "Practice Time",
      value: "42h 15m",
      icon: "timer",
    },
    {
      label: "Accuracy",
      value: "88.5%",
      icon: "trending_up",
    },
  ];

  return (
    <section className="hidden md:grid grid grid-cols-1 md:grid-cols-3 gap-gutter">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white p-4 2xl:p-stack-md rounded-xl border border-surface-variant shadow-sm flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">{stat.icon}</span>
          </div>

          <div>
            <p className="text-on-surface-variant font-label-sm text-label-sm">
              {stat.label}
            </p>
            <p className="text-[18px] leading-7 font-bold text-on-surface">{stat.value}</p>
          </div>
        </div>
      ))}
    </section>
  );
}