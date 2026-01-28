import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { motion } from 'motion/react';

interface ForgotUsernamePageProps {
  language: 'vi' | 'en';
  setLanguage: (lang: 'vi' | 'en') => void;
}

const translations = {
  vi: {
    title: 'VTIT Recuitment Portal',
    forgotUsernameTitle: 'Quên tên đăng nhập',
    email: 'Nhập email',
    verificationCode: 'Mã xác nhận',
    confirm: 'Xác nhận',
    needHelp: 'Bạn cần trợ giúp?',
    codeSent: 'Chúng tôi đã gửi một mã xác nhận đến email của bạn. Vui lòng kiểm tra email',
    helpTitle: 'Trợ giúp',
    helpMessage: 'Nếu gặp vấn đề liên quan đến tài khoản bạn vui lòng liên hệ đến số hotline 1900 9118 (Nhánh số 1) hoặc email contact@viettelsoftware.com. Nếu bạn không liên hệ được bạn có thể đi đến Tòa nhà VTIT tại 36A Dịch Vọng Hậu, Cầu Giấy, Hà Nội để được nhân viên hỗ trợ thêm'
  },
  en: {
    title: 'VTIT Recruitment Portal',
    forgotUsernameTitle: 'Forgot Username',
    email: 'Enter email',
    verificationCode: 'Verification Code',
    confirm: 'Confirm',
    needHelp: 'Need help?',
    codeSent: 'We have sent a verification code to your email. Please check your email',
    helpTitle: 'Help',
    helpMessage: 'If you have account-related problems, please contact hotline 1900 9118 (Extension 1) or email contact@viettelsoftware.com. If you cannot contact us, you can visit the VTIT building at 36A Dich Vong Hau, Cau Giay, Hanoi for additional staff support'
  }
};

export default function ForgotUsernamePage({ language }: ForgotUsernamePageProps) {
  const t = translations[language];
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showCodeInput) {
      setShowCodeInput(true);
    } else {
      window.location.href = '/reset-password';
    }
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
          <h2 className="text-2xl text-gray-900 mb-6">{t.forgotUsernameTitle}</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-gray-700">{t.email}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            {showCodeInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <Label htmlFor="code" className="text-gray-700">{t.verificationCode}</Label>
                <Input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  className="mt-1"
                />
                <p className="text-sm text-gray-600 mt-2">{t.codeSent}</p>
              </motion.div>
            )}

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
              {t.confirm}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setHelpOpen(true)}
              className="text-sm text-red-600 hover:text-red-700"
            >
              {t.needHelp}
            </button>
          </div>
        </div>
      </motion.div>

      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.helpTitle}</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-gray-700">
            {t.helpMessage}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}
