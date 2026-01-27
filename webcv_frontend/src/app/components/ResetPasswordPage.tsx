import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface ResetPasswordPageProps {
  language: 'vi' | 'en';
  setLanguage: (lang: 'vi' | 'en') => void;
}

const translations = {
  vi: {
    title: 'VTIT Recuitment Portal',
    resetPasswordTitle: 'Đặt lại mật khẩu',
    newPassword: 'Nhập mật khẩu mới',
    confirmPassword: 'Xác nhận mật khẩu mới',
    confirm: 'Xác nhận',
    successMessage: 'Bạn đã thay đổi mật khẩu thành công, vui lòng đăng nhập lại.'
  },
  en: {
    title: 'VTIT Recruitment Portal',
    resetPasswordTitle: 'Reset Password',
    newPassword: 'Enter new password',
    confirmPassword: 'Confirm new password',
    confirm: 'Confirm',
    successMessage: 'Password changed successfully, please login again.'
  }
};

export default function ResetPasswordPage({ language }: ResetPasswordPageProps) {
  const navigate = useNavigate();
  const t = translations[language];
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error(language === 'vi' ? 'Mật khẩu không khớp' : 'Passwords do not match');
      return;
    }
    
    toast.success(t.successMessage);
    setTimeout(() => navigate('/login'), 2000);
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
          <h2 className="text-2xl text-gray-900 mb-6">{t.resetPasswordTitle}</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="newPassword" className="text-gray-700">{t.newPassword}</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-gray-700">{t.confirmPassword}</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
              {t.confirm}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}