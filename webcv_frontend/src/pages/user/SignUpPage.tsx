import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { authService } from '@/services/authService';
import React from 'react';
import { Button } from '@/app/components/ui/button';

interface SignUpPageProps {
  language: 'vi' | 'en';
  setLanguage: (lang: 'vi' | 'en') => void;
}

const translations = {
  vi: {
    title: 'VTIT Recruitment Portal',
    registerTitle: 'Đăng ký tài khoản',
    registerSubtitle: 'Tạo tài khoản mới để bắt đầu',
    fullname: 'Họ và tên',
    email: 'Email',
    username: 'Tên đăng nhập',
    password: 'Mật khẩu',
    retypePassword: 'Xác nhận mật khẩu',
    registerButton: 'Đăng ký',
    registering: 'Đang xử lý...',
    haveAccount: 'Đã có tài khoản?',
    loginNow: 'Đăng nhập ngay',
    registerSuccess: 'Đăng ký thành công!',
    successMessage: 'Đăng ký thành công! Đang chuyển hướng...',
    passwordMismatch: 'Mật khẩu không khớp',
    registerError: 'Đăng ký thất bại. Vui lòng thử lại.',
    backToHome: '← Quay lại trang chủ'
  },
  en: {
    title: 'VTIT Recruitment Portal',
    registerTitle: 'Register Account',
    registerSubtitle: 'Create a new account to get started',
    fullname: 'Full Name',
    email: 'Email',
    username: 'Username',
    password: 'Password',
    retypePassword: 'Confirm Password',
    registerButton: 'Register',
    registering: 'Processing...',
    haveAccount: 'Already have an account?',
    loginNow: 'Login now',
    registerSuccess: 'Registration successful!',
    successMessage: 'Registration successful! Redirecting...',
    passwordMismatch: 'Passwords do not match',
    registerError: 'Registration failed. Please try again.',
    backToHome: '← Back to home'
  }
};

export default function SignUpPage({ language }: SignUpPageProps) {
  const navigate = useNavigate();
  const t = translations[language];
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error(t.passwordMismatch);
      return;
    }

    setIsLoading(true);

    try {
      // Xoa comment khi ket noi duoc backend:33

      // Register with backend API
      // POST /auth/register

      // const response = await authService.register(formData);

      const response = await authService.register({
          fullname: formData.fullname,
          email: formData.email,
          username: formData.username,
          password: formData.password,
          retypePassword: formData.confirmPassword,
      });

      if (response.success && response.data?.code === "200") {
              toast.success(response.data.message || t.registerSuccess);
              setTimeout(() => navigate('/signin'), 2000);
            } else {
              toast.error(response.data?.message || response.message || t.registerError);
            }


      // Thu nghiem dang ky cho dev khi chua co backend
      /*
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success(t.successMessage);
      setTimeout(() => navigate('/signin'), 1500);
    */} catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error?.message || t.registerError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">V</span>
            </div>
          </div>
          <h1 className="text-3xl text-primary">{t.title}</h1>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-2xl text-gray-900 mb-2">{t.registerTitle}</h2>
            <p className="text-gray-600 text-sm">{t.registerSubtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullname" className="text-gray-700">{t.fullname}</Label>
              <Input
                id="fullname"
                type="text"
                value={formData.fullname}
                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                required
                className="mt-1 bg-input-background border-border focus:border-primary focus:ring-primary"
                placeholder="Nguyễn Văn A"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-700">{t.email}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="mt-1 bg-input-background border-border focus:border-primary focus:ring-primary"
                placeholder="email@example.com"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="username" className="text-gray-700">{t.username}</Label>
              <Input
                id="username"
                type="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="mt-1 bg-input-background border-border focus:border-primary focus:ring-primary"
                placeholder="0123456789"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700">{t.password}</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="mt-1 bg-input-background border-border focus:border-primary focus:ring-primary"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-gray-700">{t.retypePassword}</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                className="mt-1 bg-input-background border-border focus:border-primary focus:ring-primary"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white"
              disabled={isLoading}
            >
              {isLoading ? t.registering : t.registerButton}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t.haveAccount}{' '}
              <Link to="/signin" className="text-primary hover:text-primary/80 font-medium">
                {t.loginNow}
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-gray-600 hover:text-gray-900 text-sm">
            {t.backToHome}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}