import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { authService } from '@/services/authService';

interface ResetPasswordPageProps {
  language: 'vi' | 'en';
  setLanguage: (lang: 'vi' | 'en') => void;
}

const translations = {
  vi: {
    title: 'VTIT Recruitment Portal',
    resetPasswordTitle: 'Đặt lại mật khẩu',
    resetPasswordSubtitle: 'Nhập mật khẩu mới của bạn',
    oldPassword: 'Nhập lại mật khẩu cũ',
    newPassword: 'Mật khẩu mới',
    retypeNewPassword: 'Xác nhận mật khẩu',
    resetButton: 'Đặt lại mật khẩu',
    resetting: 'Đang xử lý...',
    backToLogin: '← Quay lại đăng nhập',
    successMessage: 'Mật khẩu đã được đặt lại thành công',
    errorMessage: 'Có lỗi xảy ra. Vui lòng thử lại.',
    passwordMismatch: 'Mật khẩu không khớp',
  },
  en: {
    title: 'VTIT Recruitment Portal',
    resetPasswordTitle: 'Reset Password',
    resetPasswordSubtitle: 'Enter your new password',
    oldPassword: 'Enter old password',
    newPassword: 'New Password',
    retypeNewPassword: 'Retype New Password',
    resetButton: 'Reset Password',
    resetting: 'Processing...',
    backToLogin: '← Back to login',
    successMessage: 'Password has been reset successfully',
    errorMessage: 'An error occurred. Please try again.',
    passwordMismatch: 'Passwords do not match',
  }
};

export default function ResetPasswordPage({ language }: ResetPasswordPageProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const t = translations[language];
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: '',
    retypeNewPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.retypeNewPassword) {
      toast.error(t.passwordMismatch);
      return;
    }

    setIsLoading(true);

    try {
      // Uncomment when backend is ready
      // STEP 3: Reset password with reset token
            // POST /api/auth/changepass
            const response = await authService.changePassword({
              oldPassword: formData.oldPassword,
              newPassword: formData.newPassword,
              retypeNewPassword: formData.retypeNewPassword
            });

            if (response.success) {
              toast.success(response.data.message || t.successMessage);
              setTimeout(() => navigate('/signin'), 2000);
            } else {
              toast.error(response.message || t.errorMessage);
            }

/*
      // Mock API call for development
      await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success(t.successMessage);
            setTimeout(() => navigate('/signin'), 2000);
    */} catch (error: any) {
      console.error('Reset password error:', error);
      toast.error(error?.message || t.errorMessage);
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
            <h2 className="text-2xl text-gray-900 mb-2">{t.resetPasswordTitle}</h2>
            <p className="text-gray-600 text-sm">{t.resetPasswordSubtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="oldPassword" className="text-gray-700">{t.oldPassword}</Label>
              <Input
                id="oldPassword"
                type="password"
                value={formData.oldPassword}
                onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                required
                className="mt-1 bg-input-background border-border focus:border-primary focus:ring-primary"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="newPassword" className="text-gray-700">{t.newPassword}</Label>
              <Input
                id="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                required
                className="mt-1 bg-input-background border-border focus:border-primary focus:ring-primary"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="retypeNewPassword" className="text-gray-700">{t.retypeNewPassword}</Label>
              <Input
                id="retypeNewPassword"
                type="password"
                value={formData.retypeNewPassword}
                onChange={(e) => setFormData({ ...formData, retypeNewPassword: e.target.value })}
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
              {isLoading ? t.resetting : t.resetButton}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/signin" className="text-primary hover:text-primary/80 text-sm">
              {t.backToLogin}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
