import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { authService } from '@/services/authService';

interface SignInPageProps {
  language: 'vi' | 'en';
  setLanguage: (lang: 'vi' | 'en') => void;
}

const translations = {
  vi: {
    title: 'VTIT Recruitment Portal',
    loginTitle: 'Đăng nhập tài khoản',
    loginSubtitle: 'Đăng nhập tài khoản để bắt đầu',
    username: 'Tên đăng nhập',
    password: 'Mật khẩu',
    loginButton: 'Đăng nhập',
    loggingIn: 'Đang đăng nhập...',
    noAccount: 'Chưa có tài khoản?',
    registerNow: 'Đăng ký ngay',
    forgotPassword: 'Quên mật khẩu?',
    loginSuccess: 'Đăng nhập thành công!',
    loginError: 'Đăng nhập thất bại. Vui lòng thử lại.',
    backToHome: '← Quay lại trang chủ'
  },
  en: {
    title: 'VTIT Recruitment Portal',
    loginTitle: 'Login Account',
    loginSubtitle: 'Login to your account to get started',
    username: 'Username',
    password: 'Password',
    loginButton: 'Login',
    loggingIn: 'Logging in...',
    noAccount: "Don't have an account?",
    registerNow: 'Register now',
    forgotPassword: 'Forgot password?',
    loginSuccess: 'Login successful!',
    loginError: 'Login failed. Please try again.',
    backToHome: '← Back to home'
  }
};

export default function SignInPage({ language }: SignInPageProps) {
  const navigate = useNavigate();
  const t = translations[language];
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  // Kiểm tra nếu đã có accessToken trong localStorage thì chuyển thẳng vào dashboard
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      navigate('/dashboard'); // Nếu đã có accessToken, chuyển thẳng đến dashboard
    }
  }, [navigate]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        /** // Xoa comment khi backend san sang :33
        // Login with backend API
              // POST /auth/login
              const response = await authService.login(formData);

              if (response.success) {
                toast.success(t.loginSuccess);
                navigate('/dashboard');
              } else {
                toast.error(response.message || t.loginError);
              }
          */

      // Kiem tra login khi chua co backend
      const mockUser = {
        id: '1',
        username: formData.username,
        fullName: formData.username,
        phone: '',
      };

      const mockTokens = {
        accessToken: 'mock_access_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
      };

      //
      await new Promise(resolve => setTimeout(resolve, 1000));

      //
      localStorage.setItem('accessToken', mockTokens.accessToken);
      localStorage.setItem('refreshToken', mockTokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(mockUser));

      toast.success(t.loginSuccess);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error?.message || t.loginError);
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
            <h2 className="text-2xl text-gray-900 mb-2">{t.loginTitle}</h2>
            <p className="text-gray-600 text-sm">{t.loginSubtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-gray-700">{t.username}</Label>
              <Input
                id="username"
                type="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                className="mt-1 bg-input-background border-border focus:border-primary focus:ring-primary"
                placeholder="Nhập tên đăng nhập..."
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

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white"
              disabled={isLoading}
            >
              {isLoading ? t.loggingIn : t.loginButton}
            </Button>
          </form>

          <div className="mt-6 space-y-3">
            <p className="text-sm text-center text-gray-600">
              {t.noAccount}{' '}
              <Link to="/signup" className="text-primary hover:text-primary/80 font-medium">
                {t.registerNow}
              </Link>
            </p>
            <p className="text-sm text-center">
              <Link to="/forgot-password" className="text-primary hover:text-primary/80">
                {t.forgotPassword}
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