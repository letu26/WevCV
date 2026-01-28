import { useNavigate } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/app/components/ui/dropdown-menu';
import { useState } from 'react';
import { motion } from 'motion/react';
import React from 'react';

interface HomePageProps {
  language: 'vi' | 'en';
  setLanguage: (lang: 'vi' | 'en') => void;
}

const translations = {
  vi: {
    title: 'VTIT Recruitment portal',
    about: 'Về chúng tôi',
    language: 'VI',
    login: 'Đăng nhập',
    hero: 'Chào mừng đến với Hệ thống Tuyển dụng Viettel Software',
    heroSub: 'Nền tảng tuyển dụng hiện đại giúp kết nối tài năng với cơ hội nghề nghiệp. Tạo CV chuyên nghiệp và tìm kiếm công việc phù hợp ngay hôm nay.',
    joinNow: 'Tham gia với chúng tôi ngay hôm nay',
    whyUs: 'Tại sao chọn chúng tôi?',
    feature1Title: '1. Quản lý CV dễ dàng',
    feature1Desc: 'Tạo và quản lý CV của bạn một cách đơn giản với form động và trực quan',
    feature2Title: '2. Quy trình minh bạch',
    feature2Desc: 'Theo dõi trạng thái hồ sơ của bạn trong suốt quá trình tuyển dụng',
    feature3Title: '3. Cơ hội phát triển',
    feature3Desc: 'Tham gia các dự án thú vị và phát triển sự nghiệp của bạn',
    aboutTitle: 'Về chúng tôi',
    aboutDesc: 'Viettel Software lấy khách hàng làm trọng tâm, với sứ mệnh cung cấp cho các doanh nghiệp dịch vụ sản xuất gia công phần mềm tiên tiến nhất trên thế giới. Cùng đội ngũ nhân lực công nghệ dồi dào, chi phí thực thi thấp và chất lượng chuyên môn tốt, chúng tôi cam kết sẽ cùng bạn thay đổi và mang lại giá trị trong tương lai.',
    contactNow: 'Liên hệ ngay',
    address: '36A Dịch Vọng Hậu, Cầu Giấy, Hà Nội',
    phone: '1900 9118 (Nhánh số 1)',
    email: 'contact@viettelsoftware.com'
  },
  en: {
    title: 'VTIT Recruitment portal',
    about: 'About Us',
    language: 'EN',
    login: 'Login',
    hero: 'Welcome to Viettel Software Recruitment System',
    heroSub: 'Modern recruitment platform connecting talent with career opportunities. Create professional CVs and find suitable jobs today.',
    joinNow: 'Join us today',
    whyUs: 'Why choose us?',
    feature1Title: '1. Easy CV Management',
    feature1Desc: 'Create and manage your CV easily with dynamic and intuitive forms',
    feature2Title: '2. Transparent Process',
    feature2Desc: 'Track your application status throughout the recruitment process',
    feature3Title: '3. Growth Opportunities',
    feature3Desc: 'Join exciting projects and develop your career',
    aboutTitle: 'About Us',
    aboutDesc: 'Viettel Software is customer-centric, with a mission to provide businesses with the most advanced software production services in the world. With abundant technology personnel, low execution costs and good professional quality, we are committed to changing with you and bringing value in the future.',
    contactNow: 'Contact now',
    address: '36A Dich Vong Hau, Cau Giay, Hanoi',
    phone: '1900 9118 (Extension 1)',
    email: 'contact@viettelsoftware.com'
  }
};

export default function HomePage({ language, setLanguage }: HomePageProps) {
  const navigate = useNavigate();
  const [aboutOpen, setAboutOpen] = useState(false);
  const t = translations[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">{t.title}</span>
          </motion.div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setAboutOpen(true)}
              className="text-gray-700 hover:text-red-600 transition-colors"
            >
              {t.about}
            </button>


            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <span className="text-xs font-medium">{t.language}</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </Button>
              </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" sideOffset={4}>
                      <DropdownMenuItem onClick={() => setLanguage("vi")}>VI</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setLanguage("en")}>EN</DropdownMenuItem>
                    </DropdownMenuContent>
            </DropdownMenu>

            <Button onClick={() => navigate('/signin')} className="bg-red-600 hover:bg-red-700 text-white">
              {t.login}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-20 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          style={{
            backgroundImage: 'linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.1) 75%)',
            backgroundSize: '40px 40px'
          }}
        />

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl mb-6"
          >
            {t.hero}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-white/90"
          >
            {t.heroSub}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              onClick={() => navigate('/signup')}
              size="lg"
              className="bg-red-800 hover:bg-red-900 text-white shadow-lg hover:shadow-xl transition-all"
            >
              {t.joinNow}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl text-center mb-12 text-gray-900"
          >
            {t.whyUs}
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: t.feature1Title, desc: t.feature1Desc },
              { title: t.feature2Title, desc: t.feature2Desc },
              { title: t.feature3Title, desc: t.feature3Desc },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all border border-gray-100"
              >
                <h3 className="text-xl mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Dialog */}
      <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-red-600">{t.aboutTitle}</DialogTitle>
          </DialogHeader>
          <DialogDescription className="space-y-4 text-gray-700">
            <p className="leading-relaxed">{t.aboutDesc}</p>
            <div className="border-t pt-4 mt-4">
              <h4 className="font-semibold mb-3 text-gray-900">{t.contactNow}</h4>
              <div className="space-y-2 text-sm">
                <p>📍 {t.address}</p>
                <p>📞 {t.phone}</p>
                <p>✉️ {t.email}</p>
              </div>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}
