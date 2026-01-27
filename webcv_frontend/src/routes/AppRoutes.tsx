import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '@/pages/user/HomePage';
import SignInPage from '@/pages/user/SignInPage';
import SignUpPage from '@/pages/user/SignUpPage';
import ChangePasswordPage from '@/pages/ChangePasswordPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import CheckOtpPage from '@/pages/CheckOtpPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import Profile from '@/pages/user/Profile';
import About from '@/pages/user/About';
import Contact from '@/pages/user/Contact';
import Settings from '@/pages/Settings';
import UserLayout from '@/layout/user/UserLayout';

interface AppRoutesProps {
  language: 'vi' | 'en';
  setLanguage: (lang: 'vi' | 'en') => void;
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
      <Route path="/check-otp" element={<CheckOtpPage language={language} setLanguage={setLanguage} />} />
      <Route path="/reset-password" element={<ResetPasswordPage language={language} setLanguage={setLanguage} />} />

      {/* Protected Routes with Layout */}
      <Route path="/dashboard" element={<UserLayout language={language} setLanguage={setLanguage} />}>
        <Route index element={<Profile language={language} />} />
      </Route>
      <Route path="/profile" element={<UserLayout language={language} setLanguage={setLanguage} />}>
        <Route index element={<Profile language={language} />} />
      </Route>
      <Route path="/about" element={<UserLayout language={language} setLanguage={setLanguage} />}>
        <Route index element={<About language={language} />} />
      </Route>
      <Route path="/contact" element={<UserLayout language={language} setLanguage={setLanguage} />}>
        <Route index element={<Contact language={language} />} />
      </Route>
      <Route path="/settings" element={<UserLayout language={language} setLanguage={setLanguage} />}>
        <Route index element={<Settings language={language} setLanguage={setLanguage} />} />
      </Route>

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}