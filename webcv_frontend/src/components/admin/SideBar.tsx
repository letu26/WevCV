import { NavLink } from "react-router";

const Sidebar = () => {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `
  block px-4 py-2.5 rounded-lg
  text-sm font-medium
  transition-all duration-400 ease-out

  ${isActive
      ? "bg-purple-600 text-white"
      : "text-purple-600 hover:bg-purple-600 hover:text-white hover:translate-x-1"
    }

  focus:bg-purple-600 focus:text-white
  `;

  return (
    <div
      className="fixed top-0 left-0 w-65 h-screen bg-white text-purple-600 pt-20 border-r border-gray-200">
      <nav className="flex flex-col gap-1 px-3 mt-4">
        <NavLink to="/admin/dashboard" className={navClass}>
          Dashboard
        </NavLink>
        <NavLink to="/admin/users" className={navClass}>
          Users
        </NavLink>
      </nav>
    </div>

  );
};

export default Sidebar;
