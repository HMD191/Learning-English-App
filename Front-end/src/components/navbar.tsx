import { FaSearch, FaPlus } from "react-icons/fa";

interface NavbarProps {
  onToggleSidebar: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  return (
    <div className="navbar">
      <button className="menu-btn" onClick={onToggleSidebar}>☰</button>
      <div className="logo-circle">
        <img
          src="/image/logo.png"   // Đường dẫn ảnh của bạn trong folder public
          alt="Logo"
          // className="w-full h-full object-cover rounded-full"
        />
      </div>
      <input type="text" className="search-input" placeholder="Search..." />
      <button className="add-btn"><FaPlus /></button>
    </div>
  );
}
