"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", icon: "home", href: "/" },
    { label: "Library", icon: "menu_book", href: "/all-words" },
    { label: "Learning", icon: "school", href: "/learning" },
    { label: "New Word", icon: "add_circle", href: "/new-word" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface dark:bg-surface-dim shadow-lg flex justify-around items-center py-1.5 z-50">
      {navItems.map((item) => {
        const active = pathname === item.href;

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center gap-1 ${
              active ? "text-primary" : "text-on-surface-variant"
            }`}
          >
            <span
              className="material-symbols-outlined text-[21px]"
              style={
                active ? { fontVariationSettings: '"FILL" 1' } : undefined
              }
            >
              {item.icon}
            </span>

            <span className={`text-[10px] ${active ? "font-bold" : ""}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}