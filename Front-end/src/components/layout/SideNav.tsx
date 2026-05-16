"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: "home",
  },
  {
    label: "All Words",
    href: "/all-words",
    icon: "menu_book",
  },
  {
    label: "Notifications",
    href: "/notifications",
    icon: "notifications",
  },
  {
    label: "Learning",
    href: "/learning",
    icon: "school",
  },
  {
    label: "New Word",
    href: "/new-word",
    icon: "add_circle",
  },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col h-screen left-0 w-64 bg-surface-container-low  py-stack-lg px-stack-md shrink-0">
      {/* Logo Area */}
      <div className="mb-10 px-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-[10px] flex items-center justify-center shrink-0 shadow-sm bg-[#674bb5]">
            <span
                className="material-symbols-outlined text-white text-3xl"
                style={{ fontVariationSettings: '"FILL" 1' }}
            >
                school
            </span>
            </div>

          <div className="flex flex-col">
            <span className="font-bold leading-tight text-lg text-primary">
              English Master
            </span>
            <span className="text-[14px] text-[#374151] font-normal">
              Learn & grow
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow space-y-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 transition-all ${
                isActive
                  ? "text-primary font-bold border-r-4 border-primary bg-secondary-container/30"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={
                  isActive
                    ? { fontVariationSettings: '"FILL" 1' }
                    : undefined
                }
              >
                {item.icon}
              </span>
              <span className="font-label-md text-label-md">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer SideNav */}
      <div className="mt-auto px-4">
        <button className="w-full py-3 bg-primary-container text-on-primary-container rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity">
          Upgrade to Pro
        </button>

        <div className="mt-6 flex items-center gap-3">
          <img
            src="/image/ava.jpg"
            alt="User avatar"
            className="w-10 h-10 rounded-full object-cover bg-surface-variant"
          />

          <div>
            <p className="font-bold text-label-md">Inzy Cao</p>
            <p className="text-xs text-on-surface-variant">ID: 48291</p>
          </div>
        </div>
      </div>
    </aside>
  );
}