export default function MobileNav() {
  const navItems = [
    {
      label: "Home",
      icon: "home",
      active: true,
    },
    {
      label: "Library",
      icon: "menu_book",
      active: false,
    },
    {
      label: "Learn",
      icon: "school",
      active: false,
    },
    {
      label: "Alerts",
      icon: "notifications",
      active: false,
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface dark:bg-surface-dim shadow-lg flex justify-around items-center py-3 z-50">
      {navItems.map((item) => (
        <a
          key={item.label}
          className={`flex flex-col items-center gap-1 ${
            item.active ? "text-primary" : "text-on-surface-variant"
          }`}
          href="#"
        >
          <span
            className="material-symbols-outlined"
            style={
              item.active
                ? { fontVariationSettings: '"FILL" 1' }
                : undefined
            }
          >
            {item.icon}
          </span>

          <span className={`text-[10px] ${item.active ? "font-bold" : ""}`}>
            {item.label}
          </span>
        </a>
      ))}
    </div>
  );
}