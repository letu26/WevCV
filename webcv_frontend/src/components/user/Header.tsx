import { useNavigate, NavLink } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Button } from '@/app/components/ui/button';
import { LogOut, Settings as SettingsIcon, User } from 'lucide-react';
import { authService } from '@/services/authService';
import { toast } from 'sonner';
import React from 'react';

interface HeaderProps {
  language: 'vi' | 'en';
  setLanguage: (lang: 'vi' | 'en') => void;
}

const translations = {
  vi: {
    title: 'VTIT Recruitment portal',
    profile: 'Hồ sơ',
    settings: 'Cài đặt',
    logout: 'Đăng xuất',
    logoutSuccess: 'Đăng xuất thành công',
  },
  en: {
    title: 'VTIT Recruitment portal',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    logoutSuccess: 'Logout successful',
  },
};

export function Header({ language, setLanguage }: HeaderProps) {
  const navigate = useNavigate();
  const t = translations[language];

  const fullName = localStorage.getItem("fullname") || "User";

  const navItems = [
    { label: "Trang chủ", path: "/", end: true },
    { label: "Dự án", path: "/project" },
    { label: "Hồ sơ", path: '/profile' },
    { label: "Tạo CV", path: "/cvs-edit" },
    { label: 'Cài đặt', path: '/settings' },
  ];

  const handleLogout = async () => {
    try {
      await authService.logout();

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      toast.success(t.logoutSuccess);
      navigate('/signin');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/signin');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-white/95 backdrop-blur border-b border-border sticky top-0 z-50 shadow-sm">

      {/* GRID keeps center perfectly aligned */}
      <div className="grid grid-cols-3 items-center px-6 py-4">

        {/* LEFT — LOGO */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">V</span>
          </div>

          <h1
            className="text-xl font-bold text-gray-900 cursor-pointer hover:text-primary transition"
            onClick={() => navigate('/')}
          >
            {t.title}
          </h1>
        </div>

        {/* CENTER — NAV */}
        <nav className="hidden md:flex justify-center gap-10">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `
                relative font-medium transition-colors duration-200
                
                ${isActive
                  ? "text-primary"
                  : "text-gray-600 hover:text-primary"
                }

                after:absolute after:left-0 after:-bottom-1
                after:h-0.5 after:bg-primary
                after:transition-all after:duration-300
                
                ${isActive
                  ? "after:w-full"
                  : "after:w-0 hover:after:w-full"
                }
              `}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* RIGHT — USER */}
        <div className="flex items-center justify-end space-x-4">

          {/* Language */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {language.toUpperCase()}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage('vi')}>
                Tiếng Việt
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('en')}>
                English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* USER MENU */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-2 hover:bg-accent rounded-lg p-2 transition-colors">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-white">
                    {getInitials(fullName)}
                  </AvatarFallback>
                </Avatar>

                <span className="font-medium text-gray-700 hidden sm:block">
                  {fullName}
                </span>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="w-4 h-4 mr-2" />
                {t.profile}
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <SettingsIcon className="w-4 h-4 mr-2" />
                {t.settings}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleLogout}
                className="text-primary"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {t.logout}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export default Header;
