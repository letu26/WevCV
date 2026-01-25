import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { authService } from '@/services/authService';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';

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
    verificationCode: 'Mã xác minh',
    sendCodeButton: 'Gửi mã xác minh',
    verifyButton: 'Xác minh',
    sending: 'Đang gửi...',
    verifying: 'Đang xác minh...',
    backToLogin: '← Quay lại đăng nhập',
    codeSentMessage: 'Mã xác minh đã được gửi đến email của bạn',
    verifySuccessMessage: 'Xác minh thành công! Đang chuyển hướng...',
    errorMessage: 'Có lỗi xảy ra. Vui lòng thử lại.',
    invalidCodeMessage: 'Mã xác minh không hợp lệ',
    resendCode: 'Gửi lại mã',
    codeSent: 'Chúng tôi đã gửi một mã xác nhận đến email của bạn. Vui lòng kiểm tra email',
    helpTitle: 'Trợ giúp',
    helpMessage: 'Nếu gặp vấn đề liên quan đến tài khoản bạn vui lòng liên hệ đến số hotline 1900 9118 (Nhánh số 1) hoặc email contact@viettelsoftware.com. Nếu bạn không liên hệ được bạn có thể đi đến Tòa nhà VTIT tại 36A Dịch Vọng Hậu, Cầu Giấy, Hà Nội để được nhân viên hỗ trợ thêm'
  },
  en: {
    title: 'VTIT Recruitment Portal',
    forgotPasswordTitle: 'Forgot Password',
    forgotPasswordSubtitle: 'Enter your email to receive a verification code',
    email: 'Enter email',
    verificationCode: 'Verification Code',
    sendCodeButton: 'Send Verification Code',
    verifyButton: 'Verify',
    sending: 'Sending...',
    verifying: 'Verifying...',
    backToLogin: '← Back to login',
    codeSentMessage: 'Verification code has been sent to your email',
    verifySuccessMessage: 'Verification successful! Redirecting...',
    errorMessage: 'An error occurred. Please try again.',
    invalidCodeMessage: 'Invalid verification code',
    resendCode: 'Resend code',
    needHelp: 'Bạn cần trợ giúp?',
    codeSent: 'We have sent a verification code to your email. Please check your email',
    helpTitle: 'Help',
    helpMessage: 'If you have account-related problems, please contact hotline 1900 9118 (Extension 1) or email contact@viettelsoftware.com. If you cannot contact us, you can visit the VTIT building at 36A Dich Vong Hau, Cau Giay, Hanoi for additional staff support'
}
};

export default function ForgotPasswordPage({ language }: ForgotPasswordPageProps) {
  const navigate = useNavigate();
  const t = translations[language];
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Uncomment this when backend is ready:
      /*// STEP 1: Send email to backend to check and send OTP
            // POST /forgot/checkmail
            const response = await authService.checkEmail({ email });

            if (response.success && response.data) {
              // Save userId for next step
              setUserId(response.data.userId);
              toast.success(response.data.message || t.codeSentMessage);
              setIsCodeSent(true);
            } else {
              toast.error(response.message || t.errorMessage);
            }
        */

      // Mock API call for development
      await new Promise(resolve => setTimeout(resolve, 1000));
            const mockUserId = 3;
            setUserId(mockUserId);
            toast.success(t.codeSentMessage);
            setIsCodeSent(true);

          } catch (error: any) {
            console.error('Check email error:', error);
            toast.error(error?.message || t.errorMessage);
          } finally {
            setIsLoading(false);
          }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Uncomment this when backend is ready:
      /*// STEP 2: Verify OTP and get reset token
            // POST /forgot/checkotp
            const response = await authService.checkOTP({ userId, otp });

            if (response.success && response.data) {
              toast.success(response.data.message || t.verifySuccessMessage);
              // Navigate to reset password page with token in URL
              setTimeout(() => navigate(`/reset-password/${response.data.resetToken}`), 1000);
            } else {
              toast.error(response.message || t.invalidCodeMessage);
            }
        */

      // Mock API call for development
      await new Promise(resolve => setTimeout(resolve, 1000));
            const mockResetToken = 'bf243807-80af-4629-9b49-b9d34d5a37b3';
            toast.success(t.verifySuccessMessage);
            setTimeout(() => navigate(`/reset-password/${mockResetToken}`), 1000);
    } catch (error: any) {
      console.error('Verify OTP error:', error);
            toast.error(error?.message || t.invalidCodeMessage);
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
            <h2 className="text-2xl text-gray-900 mb-2">{t.forgotPasswordTitle}</h2>
            <p className="text-gray-600 text-sm">{t.forgotPasswordSubtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-gray-700">{t.email}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 bg-input-background border-border focus:border-primary focus:ring-primary"
                placeholder="email@example.com"
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white"
              disabled={isLoading}
            >
              {isLoading ? t.sending : t.sendCodeButton}
            </Button>
          </form>

          {isCodeSent && (
            <form onSubmit={handleVerify} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="verificationCode" className="text-gray-700">{t.verificationCode}</Label>
                <Input
                  id="verificationCode"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                  className="mt-1 bg-input-background border-border focus:border-primary focus:ring-primary"
                  placeholder="123456"
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? t.verifying : t.verifyButton}
              </Button>
            </form>
          )}

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