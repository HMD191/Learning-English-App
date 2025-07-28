import Link from "next/link";
import { FaHome, FaFolderOpen, FaBell, FaPlus } from "react-icons/fa";

interface SidebarProps {
  collapsed: boolean;
}

export default function Sidebar({ collapsed }: SidebarProps) {
  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-icons">

        <div className="icon active">
          <FaHome /> {!collapsed && <span>Home</span>}
        </div>

        <Link href="/words" className="icon">
          <FaFolderOpen /> {!collapsed && <span>Your Library</span>}
        </Link>

        <div className="icon">
          <FaBell /> {!collapsed && <span>Notifications</span>}
        </div>

        {/* 🟩 Link tới trang /new_word */}
        <Link href="/new_word" className="icon">
          <FaPlus /> {!collapsed && <span>New Word</span>}
        </Link>
        
      </div>
    </div>
  );
}
