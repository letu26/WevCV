import { Outlet } from 'react-router-dom';
import { Header } from '@/components/user/Header';
import SideBar from '@/components/user/SideBar';
import { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '@/config';

interface UserLayoutProps {
  language: 'vi' | 'en';
  setLanguage: (lang: 'vi' | 'en') => void;
}

export function UserLayout({ language, setLanguage }: UserLayoutProps) {
  const [userName, setUserName] = useState<string>('User');

  useEffect(() => {
    // Get user info from localStorage
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.fullName || user.username || user.email || 'User');
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header language={language} setLanguage={setLanguage} userName={userName} />
      <div className="flex">
        <SideBar language={language} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default UserLayout;
