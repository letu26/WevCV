import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { motion } from 'motion/react';

interface LoginPageProps {
  language: 'vi' | 'en';
  setLanguage: (lang: 'vi' | 'en') => void;
}

const translations = {
  vi: {
    title: 'VTIT Recuitment Portal',
    loginTitle: 'Đăng nhập tài khoản',
    loginSubtitle: 'Đăng nhập tài khoản để bắt đầu',
    username: 'Tên đăng nhập',
    password: 'Mật khẩu',
    loginButton: 'Đăng nhập',
    noAccount: 'Chưa có tài khoản?',
    registerNow: 'Đăng kí ngay',
    forgotPassword: 'Quên mật khẩu?'
  },
  en: {
    title: 'VTIT Recruitment Portal',
    loginTitle: 'Login Account',
    loginSubtitle: 'Login to your account to get started',
    username: 'Username',
    password: 'Password',
    loginButton: 'Login',
    noAccount: "Don't have an account?",
    registerNow: 'Register now',
    forgotPassword: 'Forgot password?'
  }
};

export default function LoginPage({ language }: LoginPageProps) {
  const navigate = useNavigate();
  const t = translations[language];
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - in real app would call API
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <h1 className="text-3xl text-center mb-8 text-red-600">{t.title}</h1>
        
        <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-2xl text-gray-900 mb-2">{t.loginTitle}</h2>
            <p className="text-gray-600 text-sm">{t.loginSubtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-gray-700">{t.username}</Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                className="mt-1"
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
                className="mt-1"
              />
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
              {t.loginButton}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              {t.noAccount}{' '}
              <Link to="/register" className="text-red-600 hover:text-red-700 font-medium">
                {t.registerNow}
              </Link>
            </p>
            <Link to="/forgot-password" className="text-sm text-red-600 hover:text-red-700 block">
              {t.forgotPassword}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}