import Header from '@/components/admin/Header';
import SideBar from '@/components/admin/SideBar';
import React from 'react';
import { Outlet } from 'react-router';

const AdminLayout: React.FC = () => {
  return (
    <>
      <Header />
      <SideBar />
      <main className="
        pt-21 pl-69 pr-6 min-h-screen
        bg-gray-100
      ">
        <Outlet />
      </main>
    </>
  );
};

export default AdminLayout;