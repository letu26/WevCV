import React from "react";
import { FiLogOut } from "react-icons/fi";
import { AiOutlineSearch } from "react-icons/ai";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSearch } from "@/hooks/useSearch";
import { FaRegUserCircle } from "react-icons/fa";

const Header: React.FC = () => {
  const { search, setSearch } = useSearch();

  const navigate = useNavigate();
  const handleClick = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("fullname");
    localStorage.removeItem("roles");
    navigate("/lead/login");
  };

  const fullname = localStorage.getItem("fullname");
  const lastName = fullname.trim().split(" ").pop();

  return (
    <header
      className="
        fixed top-0 left-65 right-0 h-20 z-50
        bg-white border-b border-gray-200
        flex items-center justify-between
        px-6
      "
    >
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <div className="w-50 flex items-center justify-around">
          <FaRegUserCircle size={35} />
          <span className="font-bold ml-3 ">Xin chào, Lead {lastName}!</span>
        </div>
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-64 pl-9 pr-3 py-2 text-sm
              rounded-md border border-gray-300
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm">
            <AiOutlineSearch size={20} />
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-6">

        {/* Notification */}
        <button className="relative text-gray-600 hover:text-gray-800">
          <FaBell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Logout */}
        <button className="text-gray-600 hover:text-gray-800" onClick={handleClick}>
          <FiLogOut size={25} />
        </button>
      </div>
    </header>
  );
};

export default Header;