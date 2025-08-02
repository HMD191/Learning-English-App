"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaFolderOpen, FaBell, FaPlus,  FaBookOpen } from "react-icons/fa";

interface SidebarProps {
  collapsed: boolean;
}

export default function Sidebar({ collapsed }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-icons">

        <Link href="/" className={`icon ${pathname === "/" ? "active" : ""}`}>
          <FaHome /> {!collapsed && <span>Home</span>}
        </Link>

        <Link href="/words" className={`icon ${pathname === "/words" ? "active" : ""}`}>
          <FaFolderOpen /> {!collapsed && <span>Your Library</span>}
        </Link>

        <Link href="/notifications" className={`icon ${pathname === "/notifications" ? "active" : ""}`}>
          <FaBell /> {!collapsed && <span>Notifications</span>}
        </Link>

        <Link href="/vocabulary" className={`icon ${pathname === "/vocabulary" ? "active" : ""}`}>
          <FaBookOpen /> {!collapsed && <span>Vocabulary</span>}
        </Link>

        <Link href="/new_word" className={`icon ${pathname === "/new_word" ? "active" : ""}`}>
          <FaPlus /> {!collapsed && <span>New Word</span>}
        </Link>
        
      </div>
    </div>
  );
}
