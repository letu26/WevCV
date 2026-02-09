import React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from 'sonner';

interface ContactProps {
  language: 'vi' | 'en';
}

const translations = {
  vi: {
    title: 'Liên hệ',
    subtitle: 'Chúng tôi luôn sẵn sàng hỗ trợ bạn',
    contactForm: 'Gửi tin nhắn',
    formDesc: 'Điền thông tin bên dưới và chúng tôi sẽ liên hệ lại với bạn sớm nhất',
    name: 'Họ và tên',
    email: 'Email',
    phone: 'Số điện thoại',
    subject: 'Tiêu đề',
    message: 'Nội dung',
    sendButton: 'Gửi tin nhắn',
    contactInfo: 'Thông tin liên hệ',
    address: 'Địa chỉ',
    addressValue: '36A Dịch Vọng Hậu, Cầu Giấy, Hà Nội',
    phoneLabel: 'Điện thoại',
    phoneValue: '1900 9118 (Nhánh số 1)',
    emailLabel: 'Email',
    emailValue: 'contact@viettelsoftware.com',
    workingHours: 'Giờ làm việc',
    workingHoursValue: 'Thứ 2 - Thứ 6: 8:00 - 17:00',
    successMessage: 'Tin nhắn của bạn đã được gửi thành công. Chúng tôi sẽ liên hệ lại sớm!',
  },
  en: {
    title: 'Contact',
    subtitle: 'We are always ready to help you',
    contactForm: 'Send a Message',
    formDesc: 'Fill in the information below and we will contact you as soon as possible',
    name: 'Full Name',
    email: 'Email',
    phone: 'Phone Number',
    subject: 'Subject',
    message: 'Message',
    sendButton: 'Send Message',
    contactInfo: 'Contact Information',
    address: 'Address',
    addressValue: '36A Dich Vong Hau, Cau Giay, Hanoi',
    phoneLabel: 'Phone',
    phoneValue: '1900 9118 (Extension 1)',
    emailLabel: 'Email',
    emailValue: 'contact@viettelsoftware.com',
    workingHours: 'Working Hours',
    workingHoursValue: 'Monday - Friday: 8:00 AM - 5:00 PM',
    successMessage: 'Your message has been sent successfully. We will contact you soon!',
  },
};

export default function Contact({ language }: ContactProps) {
  const t = translations[language];
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast.success(t.successMessage);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setIsLoading(false);
    }, 1000);
  };

  const contactItems = [
    {
      icon: MapPin,
      label: t.address,
      value: t.addressValue,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      icon: Phone,
      label: t.phoneLabel,
      value: t.phoneValue,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: Mail,
      label: t.emailLabel,
      value: t.emailValue,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">{t.title}</h1>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>{t.contactForm}</CardTitle>
              <CardDescription>{t.formDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">{t.name}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="email">{t.email}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">{t.phone}</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="subject">{t.subject}</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="message">{t.message}</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                    disabled={isLoading}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  disabled={isLoading}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isLoading ? 'Đang gửi...' : t.sendButton}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.contactInfo}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-4"
                    >
                      <div className={`w-12 h-12 ${item.bgColor} rounded-lg flex items-center justify-center shrink-0`}>
                        <Icon className={`w-6 h-6 ${item.color}`} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{item.label}</p>
                        <p className="text-gray-600 text-sm">{item.value}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Working Hours */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-2xl">🕐</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{t.workingHours}</p>
                    <p className="text-gray-600 text-sm">{t.workingHoursValue}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            <Card>
              <CardContent className="pt-6">
                <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
