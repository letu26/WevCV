import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/app/components/ui/dropdown-menu';
import { Button } from '@/app/components/ui/button';
import { LogOut, Settings as SettingsIcon, User } from 'lucide-react';
import { authService } from '@/services/authService';
import { toast } from 'sonner';

interface HeaderProps {
  language: 'vi' | 'en';
  setLanguage: (lang: 'vi' | 'en') => void;
  userName?: string;
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

export function Header({ language, setLanguage, userName = 'User' }: HeaderProps) {
  const navigate = useNavigate();
  const t = translations[language];

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success(t.logoutSuccess);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
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
    <header className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">V</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">{t.title}</h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
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

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-2 hover:bg-accent rounded-lg p-2 transition-colors">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-white">
                    {getInitials(userName)}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-gray-700">{userName}</span>
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
              <DropdownMenuItem onClick={handleLogout} className="text-primary">
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