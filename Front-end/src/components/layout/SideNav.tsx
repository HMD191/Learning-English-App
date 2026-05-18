"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: "home",
  },
  {
    label: "Library",
    href: "/all-words",
    icon: "menu_book",
  },
  // {
  //   label: "Notifications",
  //   href: "/notifications",
  //   icon: "notifications",
  // },
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

  const [username, setUsername] = useState("friend");

  useEffect(() => {
    const savedName = localStorage.getItem("english-master-username");

    if (savedName && savedName.trim()) {
      setUsername(savedName);
    }
  }, []);

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 bg-white border-r border-outline-variant/70 py-6 px-4 shrink-0">
      {/* Logo Area */}
      <div className="mb-8 px-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-primary shadow-[0_8px_20px_rgba(66,85,255,0.22)]">
            <span
              className="material-symbols-outlined text-white text-[26px]"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              school
            </span>
          </div>

          <div className="flex flex-col">
            <span className="font-bold leading-tight text-[18px] tracking-[-0.02em] text-on-surface">
              English Master
            </span>
            <span className="text-[13px] text-on-surface-variant font-medium">
              Learn & grow
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${isActive
                ? "bg-primary-container text-primary font-bold"
                : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                }`}
            >
              <span
                className={`material-symbols-outlined text-[22px] ${isActive ? "text-primary" : "text-on-surface-variant"
                  } group-hover:text-primary`}
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

              {isActive && (
                <span className="ml-auto h-2 w-2 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer SideNav */}
      <div className="mt-auto pt-6">

        <div className="mt-5 flex items-center gap-3 px-2">
          <img
            src="/image/ava.jpg"
            alt="User avatar"
            className="w-10 h-10 rounded-full object-cover bg-surface-variant border border-outline-variant"
          />

          <div className="min-w-0">
            <p className="font-bold text-label-md text-on-surface truncate">
              {username}
            </p>
            <p className="text-xs text-on-surface-variant">ID: 48291</p>
          </div>
        </div>
      </div>
    </aside>
  );
}