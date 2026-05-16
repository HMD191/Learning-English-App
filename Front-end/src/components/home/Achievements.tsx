export default function Achievements() {
  const achievements = [
    {
      title: "Fast Learner",
      icon: "bolt",
      className: "bg-secondary-container text-on-secondary-container",
    },
    {
      title: "Perfect Quiz",
      icon: "star",
      className: "bg-surface-container-highest text-primary",
    },
    {
      title: "7 Day Streak",
      icon: "calendar_today",
      className: "bg-primary-fixed text-primary",
    },
    {
      title: "Locked Achievement",
      icon: "lock",
      className: "bg-surface-container-low text-outline opacity-50",
    },
  ];

  return (
    <div className="bg-white p-stack-md rounded-xl border border-surface-variant shadow-sm">
      <h3 className="font-label-md text-label-md font-bold mb-4">
        Achievements
      </h3>

      <div className="flex flex-wrap gap-2">
        {achievements.map((achievement) => (
          <div
            key={achievement.title}
            className={`w-12 h-12 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${achievement.className}`}
            title={achievement.title}
          >
            <span className="material-symbols-outlined">
              {achievement.icon}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}