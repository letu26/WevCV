import React from "react";
import { NavLink } from "react-router";
import { RxDashboard } from "react-icons/rx";
import { CgProfile } from "react-icons/cg";
import { IoSettingsOutline } from "react-icons/io5";

const SideBar: React.FC = () => {
  return (
    <aside className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-[4px_0_12px_rgba(0,0,0,0.08)]">
      <nav className="p-4 space-y-2">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg transition
            ${isActive
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <RxDashboard className="w-5 h-5" />
          Dashboard
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg transition
            ${isActive
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <CgProfile className="w-5 h-5" />
          Profile
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg transition
            ${isActive
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <IoSettingsOutline className="w-5 h-5" />
          Settings
        </NavLink>
      </nav>
    </aside>
  );
};

export default SideBar;
