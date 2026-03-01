import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "@/pages/user/ProtectPages/HomePage";
import SignInPage from "@/pages/user/ProtectPages/SignInPage";
import SignUpPage from "@/pages/user/ProtectPages/SignUpPage";
import ChangePasswordPage from "@/pages/user/PublicPages/ChangePasswordPage";
import ForgotPasswordPage from "@/pages/user/PublicPages/ForgotPasswordPage";
import CheckOtpPage from "@/pages/user/PublicPages/CheckOtpPage";
import ResetPasswordPage from "@/pages/user/PublicPages/ResetPasswordPage";
import Profile from "@/pages/user/ProtectPages/Profile";
import About from "@/pages/user/PublicPages/About";
import Contact from "@/pages/user/ProtectPages/Contact";
import Settings from "@/pages/user/ProtectPages/Settings";
import UserLayout from "@/layout/user/UserLayout";
import DashBoard from "@/pages/admin/DashBoard";
import AdminLayout from "@/layout/admin/AdminLayout";
import AdminRoute from "./auth/AdminRoute";
import Forbidden from "@/pages/admin/Forbidden";
import LoginAdmin from "@/pages/admin/LoginAdmin";
import UserManagement from "@/pages/admin/UserManagement";
import UserRoute from "./auth/UserPoute";
import ProjectManagement from "@/pages/admin/ProjectManagement";
import ProjectDetailPage from "@/pages/admin/ProjectDetailPage";
import CurriculumVitae from "@/pages/user/ProtectPages/CurriculumVitae";
import Project from "@/pages/user/ProtectPages/Project";
import LeadRoute from "./auth/LeadRoute";
import LeadLayout from "@/layout/lead/LeadLayout";
import ManageCv from "@/pages/lead/CvManagement";
import ManageProject from "@/pages/lead/ProjectManagement";
import MyProjectPage from "@/pages/user/ProtectPages/Project";
import ShareCv from "@/pages/user/PublicPages/ShareCv";
import CvManagement from "@/pages/admin/CvManagement";

interface AppRoutesProps {
  language: "vi" | "en";
  setLanguage: (lang: "vi" | "en") => void;
}

export default function AppRoutes({ language, setLanguage }: AppRoutesProps) {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage language={language} setLanguage={setLanguage} />} />
      <Route path="/signin" element={<SignInPage language={language} setLanguage={setLanguage} />} />
      <Route path="/signup" element={<SignUpPage language={language} setLanguage={setLanguage} />} />
      <Route path="/change-password" element={<ChangePasswordPage language={language} setLanguage={setLanguage} />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage language={language} setLanguage={setLanguage} />} />
      <Route path="/check-otp" element={<CheckOtpPage language={language} />} />
      <Route path="/reset-password" element={<ResetPasswordPage language={language} setLanguage={setLanguage} />} />
      <Route path="/share-cv/:token" element={<ShareCv />} />

      {/* Protected Routes with Layout */}
      <Route element={<UserRoute />}>
        <Route
          element={<UserLayout language={language} setLanguage={setLanguage} />}
        >
          <Route path="/dashboard" element={<Profile language={language} />} />
          <Route path="/profile" element={<Profile language={language} />} />
          <Route path="/about" element={<About language={language} />} />
          <Route path="/contact" element={<Contact language={language} />} />
          <Route path="/project" element={<MyProjectPage />} />
          <Route
            path="/settings"
            element={<Settings language={language} setLanguage={setLanguage} />}
          />
          <Route path="/cvs-edit" element={<CurriculumVitae />} />
          <Route path="/project" element={<Project />} />
        </Route>
      </Route>

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />

      {/* ADMIN LOGIN */}
      <Route path="/admin/login" element={<LoginAdmin />} />
      <Route path="/403" element={<Forbidden />} />

      {/*ADMIN PROTECTED */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashBoard />} />
          <Route path="dashboard" element={<DashBoard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="cvs" element={<CvManagement />} />
          <Route path="projects" element={<ProjectManagement />} />
          <Route path="projects/:id" element={<ProjectDetailPage />} />
        </Route>
      </Route>

      <Route element={<LeadRoute />}>
        <Route path="/lead" element={<LeadLayout></LeadLayout>}>
          <Route path="cvs" element={<ManageCv />} />
          <Route path="project" element={<ManageProject />} />
          
        </Route>
      </Route>
    </Routes>
  );
}
