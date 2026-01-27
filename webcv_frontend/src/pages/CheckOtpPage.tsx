import { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { authService } from '@/services/authService';

interface ForgotPasswordPageProps {
  language: 'vi' | 'en';
}

const RESEND_TIME = 300;

export default function CheckOtpPage({ language }: ForgotPasswordPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId , email } = location.state || {};
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCounting, setIsCounting] = useState(true);
  const [counter, setCounter] = useState(RESEND_TIME);

console.log("location.state:", location.state);
console.log("userId:", userId);

  // Không có userId thì quay lại
  useEffect(() => {
    if (!userId) navigate('/change-password');
  }, [userId, navigate]);

  // Đếm ngược resend OTP
  useEffect(() => {
    if (!isCounting || counter <= 0) return;

    const timer = setInterval(() => {
      setCounter((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [counter, isCounting]);

  useEffect(() => {
    if (counter === 0) setIsCounting(false);
  }, [counter]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authService.checkOTP({
        userId,
        otp: verificationCode,
      });

      console.log("API response:", response);
      console.log("response.data:", response?.data);

      if (response?.resetToken) {
        toast.success(response.message);
        navigate(`/reset-password?token=${response.resetToken}`);
      } else {
        toast.error('OTP không đúng');
      }
    } catch (error: any) {
      toast.error(error?.message || 'OTP không hợp lệ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      await authService.resendOtp({ email });
      toast.success('Đã gửi lại mã OTP');
      setCounter(RESEND_TIME);
      setIsCounting(true);
    } catch {
      toast.error('Không thể gửi lại OTP');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Nhập mã xác minh
          </h2>

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <Label htmlFor="otp">Mã OTP</Label>
              <Input
                id="otp"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="123456"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              Xác minh
            </Button>
          </form>

          <div className="mt-4 text-center">
            {isCounting ? (
              <p className="text-sm text-gray-500">
                Gửi lại sau{' '}
                <span className="font-medium">
                  {Math.floor(counter / 60)}:
                  {(counter % 60).toString().padStart(2, '0')}
                </span>
              </p>
            ) : (
              <Button variant="link" onClick={handleResendOTP}>
                Gửi lại mã
              </Button>
            )}
          </div>

          <div className="mt-6 text-center">
            <Link to="/signin" className="text-primary text-sm">
              ← Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
