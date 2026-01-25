import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import SignInPage from '@/pages/SignInPage';
import SignUpPage from '@/pages/SignUpPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import Profile from '@/pages/Profile';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
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
      <Route path="/forgot-password" element={<ForgotPasswordPage language={language} setLanguage={setLanguage} />} />
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