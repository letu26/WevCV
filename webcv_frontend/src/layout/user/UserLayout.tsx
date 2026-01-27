import Header from '@/components/user/Header';
import SideBar from '@/components/user/SideBar';
import React from 'react';
import { Outlet } from 'react-router';

const UserLayout: React.FC = () => {
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