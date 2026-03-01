import { useNavigate, NavLink } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, } from '@/app/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/app/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { useState } from 'react';
import { motion } from 'motion/react';
import React from 'react';
import { LogOut, Settings as SettingsIcon, User } from 'lucide-react';
import authService from '@/services/authService';
import { toast } from 'sonner';

interface HomePageProps {
  language: 'vi' | 'en';
  setLanguage: (lang: 'vi' | 'en') => void;
}

const translations = {
  vi: {
    title: 'VTIT Recruitment portal',
    about: 'Về chúng tôi',
    language: 'VI',
    login: 'Đăng nhập',
    hero: 'Chào mừng đến với Hệ thống Tuyển dụng Viettel Software',
    heroSub:
      'Nền tảng tuyển dụng hiện đại giúp kết nối tài năng với cơ hội nghề nghiệp.',
    joinNow: 'Tham gia với chúng tôi ngay hôm nay',
    aboutTitle: 'Về chúng tôi',
    aboutDesc: 'Viettel Software lấy khách hàng làm trọng tâm...',
    contactNow: 'Liên hệ ngay',
    address: '36A Dịch Vọng Hậu, Cầu Giấy, Hà Nội',
    phone: '1900 9118 (Nhánh số 1)',
    email: 'contact@viettelsoftware.com',
    profile: 'Hồ sơ',
    settings: 'Cài đặt',
    logout: 'Đăng xuất',
    logoutSuccess: 'Đăng xuất thành công',
  },
  en: {
    title: 'VTIT Recruitment portal',
    about: 'About Us',
    language: 'EN',
    login: 'Login',
    hero: 'Welcome to Viettel Software Recruitment System',
    heroSub:
      'Modern recruitment platform connecting talent with career opportunities.',
    joinNow: 'Join us today',
    aboutTitle: 'About Us',
    aboutDesc: 'Viettel Software is customer-centric...',
    contactNow: 'Contact now',
    address: '36A Dich Vong Hau, Cau Giay, Hanoi',
    phone: '1900 9118 (Extension 1)',
    email: 'contact@viettelsoftware.com',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    logoutSuccess: 'Logout successful',
  },
};

export default function HomePage({ language, setLanguage }: HomePageProps) {
  const navigate = useNavigate();
  const [aboutOpen, setAboutOpen] = useState(false);
  const t = translations[language];

  const fullName = localStorage.getItem('fullname') || 'User';
  const userId = localStorage.getItem('userId');
  const isLoggedIn = !!userId;

  const navItems = [
    { label: 'Trang chủ', path: '/', end: true },
    { label: 'Dự án', path: '/project' },
    { label: 'Hồ sơ', path: '/profile' },
    { label: 'Tạo CV', path: '/cvs-edit' },
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
      navigate('/signin');
    }
  };

  const getInitials = (name: string) => name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">

      {/* HEADER */}
      <header className="bg-white/95 backdrop-blur border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto grid grid-cols-3 items-center px-6 py-4">

          {/* LOGO */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center hover:scale-105 transition">
              <span className="text-white font-bold text-xl">V</span>
            </div>

            <span className="text-xl font-semibold text-gray-900">
              {t.title}
            </span>
          </div>

          {/* NAVIGATION */}
          <nav className="hidden md:flex justify-center gap-10 w-130">
            {isLoggedIn &&
              navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) => `
                    relative font-medium transition-colors duration-200
                    ${isActive
                      ? 'text-red-600'
                      : 'text-gray-600 hover:text-red-600'}
                    
                    after:absolute after:left-0 after:-bottom-1
                    after:h-0.5 after:bg-red-600
                    after:transition-all after:duration-300
                    
                    ${isActive
                      ? 'after:w-full'
                      : 'after:w-0 hover:after:w-full'}
                  `}
                >
                  {item.label}
                </NavLink>
              ))}
          </nav>

          {/* RIGHT */}
          <div className="flex items-center justify-end gap-4">

            {/* USER — logged in */}
            {isLoggedIn ? (
              <>
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
              </>
            ) : (
              <>
                {/* Guest */}
                <button
                  onClick={() => setAboutOpen(true)}
                  className="text-gray-700 hover:text-red-600 transition"
                >
                  {t.about}
                </button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      {t.language}
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setLanguage('vi')}>
                      VI
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage('en')}>
                      EN
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  onClick={() => navigate('/signin')}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {t.login}
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-linear-to-r from-red-600 to-red-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h1 className="text-4xl md:text-5xl mb-6">
            {t.hero}
          </motion.h1>

          <motion.p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
            {t.heroSub}
          </motion.p>

          {!isLoggedIn && (
            <Button
              onClick={() => navigate('/signup')}
              size="lg"
              className="bg-red-800 hover:bg-red-900 text-white shadow-lg hover:shadow-xl transition"
            >
              {t.joinNow}
            </Button>
          )}
        </div>
      </section>

      {/* ABOUT DIALOG */}
      <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-red-600">
              {t.aboutTitle}
            </DialogTitle>
          </DialogHeader>

          <DialogDescription className="space-y-4 text-gray-700">
            <p>{t.aboutDesc}</p>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">{t.contactNow}</h4>
              <p>{t.address}</p>
              <p>{t.phone}</p>
              <p>{t.email}</p>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}