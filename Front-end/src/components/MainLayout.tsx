"use client";

import { useState } from "react";
import Sidebar from "./sidebar";
import Navbar from "./navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      <Navbar onToggleSidebar={() => setCollapsed(!collapsed)} />
      
      <div className="row">
        {/* Sidebar bên trái */}
        <div className="column_sidebar"style={{
          width: collapsed ? "60px" : "170px",
        }}>
          <Sidebar collapsed={collapsed} />
        </div>

        {/* Nội dung chính bên phải */}
        <div className="column_content">
          {children}
        </div>
      </div>
    </div>
  );
}
