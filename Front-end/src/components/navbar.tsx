import { FaSearch, FaPlus } from "react-icons/fa";

interface NavbarProps {
  onToggleSidebar: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  return (
    <div className="navbar">
      <button className="menu-btn" onClick={onToggleSidebar}>☰</button>
      <div className="logo-circle">logo</div>
      <input type="text" className="search-input" placeholder="Search..." />
      <button className="add-btn"><FaPlus /></button>
    </div>
  );
}
