import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Building2, Users, Target, Award } from 'lucide-react';

interface AboutProps {
  language: 'vi' | 'en';
}

const translations = {
  vi: {
    title: 'Về chúng tôi',
    subtitle: 'Tìm hiểu về Viettel Software',
    companyName: 'Viettel Software',
    mission: 'Sứ mệnh',
    missionDesc: 'Viettel Software lấy khách hàng làm trọng tâm, với sứ mệnh cung cấp cho các doanh nghiệp dịch vụ sản xuất gia công phần mềm tiên tiến nhất trên thế giới. Cùng đội ngũ nhân lực công nghệ dồi dào, chi phí thực thi thấp và chất lượng chuyên môn tốt, chúng tôi cam kết sẽ cùng bạn thay đổi và mang lại giá trị trong tương lai.',
    vision: 'Tầm nhìn',
    visionDesc: 'Trở thành công ty phần mềm hàng đầu Việt Nam, cung cấp các giải pháp công nghệ sáng tạo và chất lượng cao cho khách hàng toàn cầu.',
    values: 'Giá trị cốt lõi',
    value1Title: 'Chất lượng',
    value1Desc: 'Cam kết mang đến sản phẩm và dịch vụ chất lượng cao nhất',
    value2Title: 'Đội ngũ',
    value2Desc: 'Xây dựng đội ngũ nhân viên tài năng và chuyên nghiệp',
    value3Title: 'Sáng tạo',
    value3Desc: 'Không ngừng đổi mới và áp dụng công nghệ tiên tiến',
    value4Title: 'Cam kết',
    value4Desc: 'Luôn thực hiện đúng cam kết với khách hàng và đối tác',
    contact: 'Thông tin liên hệ',
    address: 'Địa chỉ: 36A Dịch Vọng Hậu, Cầu Giấy, Hà Nội',
    phone: 'Điện thoại: 1900 9118 (Nhánh số 1)',
    email: 'Email: contact@viettelsoftware.com',
    website: 'Website: www.viettelsoftware.com',
  },
  en: {
    title: 'About Us',
    subtitle: 'Learn about Viettel Software',
    companyName: 'Viettel Software',
    mission: 'Mission',
    missionDesc: 'Viettel Software is customer-centric, with a mission to provide businesses with the most advanced software production services in the world. With abundant technology personnel, low execution costs and good professional quality, we are committed to changing with you and bringing value in the future.',
    vision: 'Vision',
    visionDesc: "To become Vietnam's leading software company, providing innovative and high-quality technology solutions for global customers.",
    values: 'Core Values',
    value1Title: 'Quality',
    value1Desc: 'Committed to delivering the highest quality products and services',
    value2Title: 'Team',
    value2Desc: 'Building a talented and professional workforce',
    value3Title: 'Innovation',
    value3Desc: 'Continuously innovating and applying advanced technology',
    value4Title: 'Commitment',
    value4Desc: 'Always fulfill commitments to customers and partners',
    contact: 'Contact Information',
    address: 'Address: 36A Dich Vong Hau, Cau Giay, Hanoi',
    phone: 'Phone: 1900 9118 (Extension 1)',
    email: 'Email: contact@viettelsoftware.com',
    website: 'Website: www.viettelsoftware.com',
  },
};

export default function About({ language }: AboutProps) {
  const t = translations[language];

  const values = [
    { icon: Award, title: t.value1Title, desc: t.value1Desc },
    { icon: Users, title: t.value2Title, desc: t.value2Desc },
    { icon: Target, title: t.value3Title, desc: t.value3Desc },
    { icon: Building2, title: t.value4Title, desc: t.value4Desc },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">{t.title}</h1>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>

        {/* Company Overview */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-2xl">V</span>
              </div>
              <CardTitle className="text-2xl">{t.companyName}</CardTitle>
            </div>
          </CardHeader>
        </Card>

        {/* Mission */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Target className="w-5 h-5" />
              {t.mission}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{t.missionDesc}</p>
          </CardContent>
        </Card>

        {/* Vision */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Building2 className="w-5 h-5" />
              {t.vision}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{t.visionDesc}</p>
          </CardContent>
        </Card>

        {/* Core Values */}
        <div className="mb-8">
          <h2 className="text-2xl text-gray-900 mb-4">{t.values}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                          <p className="text-gray-600 text-sm">{value.desc}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">{t.contact}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-gray-700">📍 {t.address}</p>
            <p className="text-gray-700">📞 {t.phone}</p>
            <p className="text-gray-700">✉️ {t.email}</p>
            <p className="text-gray-700">🌐 {t.website}</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
