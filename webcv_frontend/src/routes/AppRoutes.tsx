import { Routes, Route } from "react-router";

import HomePage from "@/pages/user/HomePage";
import SignInPage from "@/pages/user/SignInPage";
import SignUpPage from "@/pages/user/SignUpPage";
import About from "@/pages/user/About";
import Setting from "@/pages/user/Setting";
import Profile from "@/pages/user/Profile";
import Contact from "@/pages/user/Contact";
import UserLayout from "@/layout/user/UserLayout";
import AdminLayout from "@/layout/admin/AdminLayout";
import DashBoard from "@/pages/admin/DashBoard";
import User from "@/pages/admin/UserManagement";
import LoginAdmin from "@/pages/admin/LoginAdmin";
import Forbidden from "@/pages/admin/Forbidden";
import AdminRoute from "./auth/AdminRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Trang user */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/settings" element={<Setting />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
      
      {/* Trang admin */}
      <Route path="/admin/login" element={<LoginAdmin />} />
      <Route path="/403" element={<Forbidden />} />

      {/*ADMIN PROTECTED */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashBoard />} />
          <Route path="dashboard" element={<DashBoard />} />
          <Route path="users" element={<User />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
