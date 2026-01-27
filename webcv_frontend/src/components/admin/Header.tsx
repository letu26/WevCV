import React from "react";
import { AiOutlineSearch } from "react-icons/ai";

const Header: React.FC = () => {
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
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="
              w-64 pl-9 pr-3 py-2 text-sm
              rounded-md border border-gray-300
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm">
            <AiOutlineSearch size={20}/>
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-6">
        {/* Language */}
        <div className="flex items-center gap-1 text-sm text-gray-600 cursor-pointer">
          <span>US</span>
          <span>English</span>
        </div>

        {/* Notification */}
        <button className="relative text-gray-600 hover:text-gray-800">
          🔔
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold cursor-pointer">
          A
        </div>
      </div>
    </header>
  );
};

export default Header;
