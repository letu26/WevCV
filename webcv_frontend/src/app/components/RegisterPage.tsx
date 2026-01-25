import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface RegisterPageProps {
  language: 'vi' | 'en';
  setLanguage: (lang: 'vi' | 'en') => void;
}

const translations = {
  vi: {
    title: 'VTIT Recuitment Portal',
    registerTitle: 'Đăng ký tài khoản',
    registerSubtitle: 'Tạo tài khoản mới để bắt đầu',
    fullName: 'Họ và tên',
    email: 'Email',
    username: 'Tên đăng nhập',
    password: 'Mật khẩu',
    confirmPassword: 'Xác nhận mật khẩu',
    registerButton: 'Đăng kí',
    haveAccount: 'Đã có tài khoản?',
    loginNow: 'Đăng nhập ngay',
    successMessage: 'Bạn đã đăng kí thành công. Đăng nhập ngay'
  },
  en: {
    title: 'VTIT Recruitment Portal',
    registerTitle: 'Register Account',
    registerSubtitle: 'Create a new account to get started',
    fullName: 'Full Name',
    email: 'Email',
    username: 'Username',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    registerButton: 'Register',
    haveAccount: 'Already have an account?',
    loginNow: 'Login now',
    successMessage: 'Registration successful. Please login'
  }
};

export default function RegisterPage({ language }: RegisterPageProps) {
  const navigate = useNavigate();
  const t = translations[language];
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error(language === 'vi' ? 'Mật khẩu không khớp' : 'Passwords do not match');
      return;
    }
    
    toast.success(t.successMessage);
    setTimeout(() => navigate('/login'), 1500);
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
            <h2 className="text-2xl text-gray-900 mb-2">{t.registerTitle}</h2>
            <p className="text-gray-600 text-sm">{t.registerSubtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullName" className="text-gray-700">{t.fullName}</Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                className="mt-1"
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
                className="mt-1"
              />
            </div>

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

            <div>
              <Label htmlFor="confirmPassword" className="text-gray-700">{t.confirmPassword}</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                className="mt-1"
              />
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
              {t.registerButton}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t.haveAccount}{' '}
              <Link to="/login" className="text-red-600 hover:text-red-700 font-medium">
                {t.loginNow}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}