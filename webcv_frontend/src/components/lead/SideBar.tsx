import { NavLink,useNavigate } from "react-router";
import React from "react";
import { Briefcase, FileText, LayoutDashboard, Users } from "lucide-react";
import { Button } from '@/app/components/ui/button';
import authService from "@/services/authService";
import { toast } from "sonner";

const Sidebar = () => {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `
    flex items-center gap-3
    px-4 py-2 rounded-lg
    font-semibold
    transition-all duration-300
    ${isActive
      ? "bg-indigo-50 text-indigo-600"
      : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
    }
  `;
  const navigate = useNavigate();

  
  const handleLogout = async () => {
    try {
      await authService.logout();

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      navigate('/admin/login');
    } catch (error) {
      navigate('/admin/login');
    }
  };

  return (
    <aside className="fixed top-0 left-0 w-65 h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="h-20 flex items-center justify-center border-b border-gray-200">
        <span className="text-lg font-bold bg-linear-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
          Lead
        </span>
      </div>  

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <NavLink to={"/lead/cvs"} className={navClass}>
          <FileText size={20} /> Quản lý CV
        </NavLink>
        <NavLink to={"/lead/project"} className={navClass}>
          <Briefcase size={20} /> Quản lý Project
        </NavLink>
        <Button className="ml-11" onClick={handleLogout}>
           Đăng xuất
        </Button>
      </nav>
    </aside>

  );
};

export default Sidebar;