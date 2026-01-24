import Header from '@/components/Header';
import SideBar from '@/components/SideBar';
import React from 'react';
import { Outlet } from 'react-router';

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
    <>
      <Header/>
      <SideBar/>
      <main className="pt-21 pl-69 pr-5 min-h-screen bg-gray-50">
        <Outlet/>
      </main>
    </>
  );
};

export default UserLayout;