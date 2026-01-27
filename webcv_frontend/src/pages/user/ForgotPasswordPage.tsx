import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { authService } from '@/services/authService';
import React from 'react';

interface ForgotPasswordPageProps {
  language: 'vi' | 'en';
  setLanguage: (lang: 'vi' | 'en') => void;
}

const translations = {
  vi: {
    title: 'VTIT Recruitment Portal',
    forgotPasswordTitle: 'Quên mật khẩu',
    forgotPasswordSubtitle: 'Nhập email của bạn để nhận mã xác minh',
    email: 'Nhập email',
    sendCodeButton: 'Gửi mã xác minh',
    sending: 'Đang gửi...',
    backToLogin: '← Quay lại đăng nhập',
    codeSentMessage: 'Mã xác minh đã được gửi đến email của bạn',
    errorMessage: 'Có lỗi xảy ra. Vui lòng thử lại.',
  },
  en: {
    title: 'VTIT Recruitment Portal',
    forgotPasswordTitle: 'Forgot Password',
    forgotPasswordSubtitle: 'Enter your email to receive a verification code',
    email: 'Enter email',
    sendCodeButton: 'Send Verification Code',
    sending: 'Sending...',
    backToLogin: '← Back to login',
    codeSentMessage: 'Verification code has been sent to your email',
    errorMessage: 'An error occurred. Please try again.',
  },
};

export default function ForgotPasswordPage({ language }: ForgotPasswordPageProps) {
  const navigate = useNavigate();
  const t = translations[language];

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authService.checkEmail({ email });

      console.log("response:", response);
      console.log("response.success:", response.success);
      console.log("response.data:", response.data);

      if (response.data?.code === "201" && response.data?.userId) {
        toast.success(response.data.message || t.codeSentMessage);
        console.log("Navigate to /check-otp");
        navigate('/check-otp', {
          state: { userId: Number(response.data.userId) , email},
        });
      } else {
        console.log("Condition failed");
        toast.error(response.data?.message || response.message || t.errorMessage);
      }
    } catch (error: any) {
      console.error('Check email error:', error);
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
          <h1 className="text-3xl text-primary">{t.title}</h1>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-2xl text-gray-900 mb-2">
              {t.forgotPasswordTitle}
            </h2>
            <p className="text-gray-600 text-sm">
              {t.forgotPasswordSubtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">{t.email}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                placeholder="email@example.com"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t.sending : t.sendCodeButton}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/signin" className="text-primary text-sm">
              {t.backToLogin}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
