import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Separator } from '@/app/components/ui/separator';
import { motion } from 'motion/react';
import { User, Lock, Bell, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { STORAGE_KEYS } from '@/config';
import { useNavigate, Link } from 'react-router-dom';

interface SettingsProps {
  language: 'vi' | 'en';
  setLanguage: (lang: 'vi' | 'en') => void;
}

const translations = {
  vi: {
    title: 'Cài đặt',
    subtitle: 'Quản lý cài đặt tài khoản và ứng dụng',
    accountSettings: 'Cài đặt tài khoản',
    accountDesc: 'Cập nhật thông tin cá nhân của bạn',
    fullName: 'Họ và tên',
    email: 'Email',
    phone: 'Số điện thoại',
    username: 'Tên đăng nhập',
    saveChanges: 'Lưu thay đổi',
    passwordSettings: 'Đổi mật khẩu',
    passwordDesc: 'Cập nhật mật khẩu để bảo mật tài khoản',
    currentPassword: 'Mật khẩu hiện tại',
    newPassword: 'Mật khẩu mới',
    confirmPassword: 'Xác nhận mật khẩu',
    updatePassword: 'Cập nhật mật khẩu',
    languageSettings: 'Ngôn ngữ',
    languageDesc: 'Chọn ngôn ngữ hiển thị',
    vietnamese: 'Tiếng Việt',
    english: 'English',
    notificationSettings: 'Thông báo',
    notificationDesc: 'Quản lý các thông báo của bạn',
    emailNotifications: 'Nhận thông báo qua email',
    cvStatusUpdates: 'Cập nhật trạng thái CV',
    successUpdate: 'Cập nhật thành công',
    passwordMismatch: 'Mật khẩu xác nhận không khớp',
    passwordUpdated: 'Mật khẩu đã được cập nhật',
  },
  en: {
    title: 'Settings',
    subtitle: 'Manage your account and application settings',
    accountSettings: 'Account Settings',
    accountDesc: 'Update your personal information',
    fullName: 'Full Name',
    email: 'Email',
    phone: 'Phone Number',
    username: 'Username',
    saveChanges: 'Save Changes',
    passwordSettings: 'Change Password',
    passwordDesc: 'Update your password to secure your account',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
    updatePassword: 'Update Password',
    languageSettings: 'Language',
    languageDesc: 'Select display language',
    vietnamese: 'Vietnamese',
    english: 'English',
    notificationSettings: 'Notifications',
    notificationDesc: 'Manage your notifications',
    emailNotifications: 'Receive email notifications',
    cvStatusUpdates: 'CV status updates',
    successUpdate: 'Updated successfully',
    passwordMismatch: 'Confirm password does not match',
    passwordUpdated: 'Password has been updated',
  },
};

export default function Settings({ language, setLanguage }: SettingsProps) {
    const navigate = useNavigate();
  const t = translations[language];
  const [isLoading, setIsLoading] = useState(false);
  const [accountData, setAccountData] = useState({
    fullName: '',
    email: '',
    phone: '',
    username: '',



  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    reTypePassword: '',
  });



  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    cvStatusUpdates: true,
  });

  useEffect(() => {
    // Load user data from localStorage
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setAccountData({
          fullName: user.fullName || '',
          email: user.email || '',
          phone: user.phone || '',
          username: user.username || '',
        });
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
  }, []);

  const handleAccountUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Update localStorage
      const userStr = localStorage.getItem(STORAGE_KEYS.USER);
      if (userStr) {
        const user = JSON.parse(userStr);
        const updatedUser = { ...user, ...accountData };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      }

      toast.success(t.successUpdate);
      setIsLoading(false);
    }, 1000);
  };
const handlePasswordUpdate = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    /*await AuthService.verifyCurrentPassword({
      currentPassword: passwordData.currentPassword,
    });*/

    navigate("/change-password");
  } catch (error: any) {
    toast.error(error.message || "Mật khẩu hiện tại không đúng");
  } finally {
    setIsLoading(false);
  }
};
/*
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error(t.passwordMismatch);
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast.success(t.passwordUpdated);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setIsLoading(false);
    }, 1000);
  };*/

  const handleLanguageChange = (newLang: 'vi' | 'en') => {
    setLanguage(newLang);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, newLang);
    toast.success(t.successUpdate);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">{t.title}</h1>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>

        <div className="space-y-6">
          {/* Account Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-red-600" />
                <CardTitle>{t.accountSettings}</CardTitle>
              </div>
              <CardDescription>{t.accountDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAccountUpdate} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">{t.fullName}</Label>
                    <Input
                      id="fullName"
                      value={accountData.fullName}
                      onChange={(e) => setAccountData({ ...accountData, fullName: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="username">{t.username}</Label>
                    <Input
                      id="username"
                      value={accountData.username}
                      onChange={(e) => setAccountData({ ...accountData, username: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">{t.email}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={accountData.email}
                      onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">{t.phone}</Label>
                    <Input
                      id="phone"
                      value={accountData.phone}
                      onChange={(e) => setAccountData({ ...accountData, phone: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  disabled={isLoading}
                >
                  {t.saveChanges}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Password Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-red-600" />
                <CardTitle>{t.passwordSettings}</CardTitle>
              </div>
              <CardDescription>{t.passwordDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">{t.currentPassword}</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    disabled={isLoading}
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  disabled={isLoading}
                >
                  {t.updatePassword}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Language Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-red-600" />
                <CardTitle>{t.languageSettings}</CardTitle>
              </div>
              <CardDescription>{t.languageDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button
                  variant={language === 'vi' ? 'default' : 'outline'}
                  onClick={() => handleLanguageChange('vi')}
                  className={language === 'vi' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
                >
                  {t.vietnamese}
                </Button>
                <Button
                  variant={language === 'en' ? 'default' : 'outline'}
                  onClick={() => handleLanguageChange('en')}
                  className={language === 'en' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
                >
                  {t.english}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-red-600" />
                <CardTitle>{t.notificationSettings}</CardTitle>
              </div>
              <CardDescription>{t.notificationDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{t.emailNotifications}</p>
                    <p className="text-sm text-gray-600">{t.cvStatusUpdates}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.emailNotifications}
                      onChange={(e) => setNotifications({ ...notifications, emailNotifications: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
