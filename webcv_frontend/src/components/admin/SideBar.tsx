import { NavLink } from "react-router";
import React from "react";
import { Briefcase, FileText, LayoutDashboard, Users } from "lucide-react";

const Sidebar = () => {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `
    flex items-center gap-3
    px-4 py-2 rounded-lg
    font-semibold
    transition-all duration-300
    ${
      isActive
        ? "bg-indigo-100 dark:bg-indigo-600 text-indigo-600 dark:text-white"
        : "text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-800"
    }
  `;

  return (
    <aside className="
      fixed top-0 left-0 w-65 h-screen
      bg-white dark:bg-gray-900
      border-r border-gray-200 dark:border-gray-800
      flex flex-col
      text-gray-700 dark:text-gray-200
      transition
    ">
      <div className="h-20 flex items-center justify-center border-b border-gray-200">
        <span className="text-lg font-bold bg-linear-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
          CV Admin
        </span>
      </div>  

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <NavLink to={"/admin/dashboard"} className={navClass}>
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        <NavLink to={"/admin/cvs"} className={navClass}>
          <FileText size={20} /> Quản lý CV
        </NavLink>
        <NavLink to={"/admin/projects"} className={navClass}>
          <Briefcase size={20} /> Quản lý Project
        </NavLink>
        <NavLink to={"/admin/users"} className={navClass}>
          <Users size={20} /> Quản lý User
        </NavLink>
      </nav>
    </aside>

  );
};

export default Sidebar;