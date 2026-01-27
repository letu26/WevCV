import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/app/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { motion } from 'motion/react';
import { Plus, Edit, Eye, X } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';

interface UserDashboardProps {
  language: 'vi' | 'en';
  setLanguage: (lang: 'vi' | 'en') => void;
}

interface Project {
  name: string;
  description: string;
}

interface CV {
  id: string;
  email: string;
  projects: Project[];
  skills: string[];
  status: 'draft' | 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  careerGoal?: string;
  additionalInfo?: string;
}

const translations = {
  vi: {
    title: 'VTIT Recuitment portal',
    hello: 'Xin chào',
    changePassword: 'Đổi mật khẩu',
    logout: 'Đăng xuất',
    noCVs: 'Hiện không có cv mới nào',
    addCV: 'Thêm cv ứng tuyển ngay',
    addNewCV: 'Thêm cv mới',
    editCV: 'Chỉnh sửa CV',
    viewCV: 'Xem CV',
    createCVTitle: 'Tạo CV mới',
    createCVSubtitle: 'Điền đầy đủ thông tin để tạo CV chuyên nghiệp của bạn',
    editCVTitle: 'Chỉnh sửa CV',
    editCVSubtitle: 'Đừng quên lưu lại khi bạn đã chỉnh sửa xong',
    personalInfo: 'Thông tin cá nhân',
    email: 'Email',
    projects: 'Dự án',
    projectName: 'Tên dự án',
    projectDescription: 'Mô tả',
    addProject: 'Thêm',
    skills: 'Kỹ năng',
    addSkill: 'Thêm',
    careerGoal: 'Mục tiêu nghề nghiệp',
    additionalInfo: 'Thông tin thêm',
    saveDraft: 'Lưu nháp',
    submit: 'Gửi',
    cancel: 'Hủy',
    statusDraft: 'Bản nháp',
    statusPending: 'Đang duyệt',
    statusAccepted: 'Đã chấp nhận',
    statusRejected: 'Đã từ chối',
    projectsCount: 'dự án',
    skillsCount: 'kỹ năng',
    createdDate: 'Ngày tạo'
  },
  en: {
    title: 'VTIT Recruitment portal',
    hello: 'Hello',
    changePassword: 'Change Password',
    logout: 'Logout',
    noCVs: 'No CVs available',
    addCV: 'Add CV now',
    addNewCV: 'Add new CV',
    editCV: 'Edit CV',
    viewCV: 'View CV',
    createCVTitle: 'Create New CV',
    createCVSubtitle: 'Fill in all information to create your professional CV',
    editCVTitle: 'Edit CV',
    editCVSubtitle: "Don't forget to save when you're done editing",
    personalInfo: 'Personal Information',
    email: 'Email',
    projects: 'Projects',
    projectName: 'Project Name',
    projectDescription: 'Description',
    addProject: 'Add',
    skills: 'Skills',
    addSkill: 'Add',
    careerGoal: 'Career Goal',
    additionalInfo: 'Additional Information',
    saveDraft: 'Save Draft',
    submit: 'Submit',
    cancel: 'Cancel',
    statusDraft: 'Draft',
    statusPending: 'Pending',
    statusAccepted: 'Accepted',
    statusRejected: 'Rejected',
    projectsCount: 'projects',
    skillsCount: 'skills',
    createdDate: 'Created date'
  }
};

export default function UserDashboard({ language }: UserDashboardProps) {
  const navigate = useNavigate();
  const t = translations[language];
  const [cvs, setCvs] = useState<CV[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingCV, setEditingCV] = useState<CV | null>(null);
  const [viewingCV, setViewingCV] = useState<CV | null>(null);
  
  const [formData, setFormData] = useState({
    email: '',
    projects: [{ name: '', description: '' }] as Project[],
    skills: [''],
    careerGoal: '',
    additionalInfo: ''
  });

  const handleLogout = () => {
    navigate('/');
  };

  const resetForm = () => {
    setFormData({
      email: '',
      projects: [{ name: '', description: '' }],
      skills: [''],
      careerGoal: '',
      additionalInfo: ''
    });
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsCreating(true);
  };

  const handleOpenEdit = (cv: CV) => {
    setFormData({
      email: cv.email,
      projects: cv.projects.length > 0 ? cv.projects : [{ name: '', description: '' }],
      skills: cv.skills.length > 0 ? cv.skills : [''],
      careerGoal: cv.careerGoal || '',
      additionalInfo: cv.additionalInfo || ''
    });
    setEditingCV(cv);
  };

  const handleSave = (isDraft: boolean) => {
    const newCV: CV = {
      id: editingCV?.id || Date.now().toString(),
      email: formData.email,
      projects: formData.projects.filter(p => p.name || p.description),
      skills: formData.skills.filter(s => s.trim()),
      status: isDraft ? 'draft' : 'pending',
      createdAt: editingCV?.createdAt || new Date().toLocaleDateString(),
      careerGoal: formData.careerGoal,
      additionalInfo: formData.additionalInfo
    };

    if (editingCV) {
      setCvs(cvs.map(cv => cv.id === editingCV.id ? newCV : cv));
      setEditingCV(null);
    } else {
      setCvs([...cvs, newCV]);
      setIsCreating(false);
    }
    resetForm();
  };

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [...formData.projects, { name: '', description: '' }]
    });
  };

  const updateProject = (index: number, field: 'name' | 'description', value: string) => {
    const newProjects = [...formData.projects];
    newProjects[index][field] = value;
    setFormData({ ...formData, projects: newProjects });
  };

  const removeProject = (index: number) => {
    setFormData({
      ...formData,
      projects: formData.projects.filter((_, i) => i !== index)
    });
  };

  const addSkill = () => {
    setFormData({
      ...formData,
      skills: [...formData.skills, '']
    });
  };

  const updateSkill = (index: number, value: string) => {
    const newSkills = [...formData.skills];
    newSkills[index] = value;
    setFormData({ ...formData, skills: newSkills });
  };

  const removeSkill = (index: number) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index)
    });
  };

  const getStatusBadge = (status: CV['status']) => {
    const statusMap = {
      draft: { label: t.statusDraft, className: 'bg-gray-500' },
      pending: { label: t.statusPending, className: 'bg-yellow-500' },
      accepted: { label: t.statusAccepted, className: 'bg-green-500' },
      rejected: { label: t.statusRejected, className: 'bg-red-500' }
    };
    const s = statusMap[status];
    return <Badge className={`${s.className} text-white`}>{s.label}</Badge>;
  };

  const canEdit = (cv: CV) => cv.status === 'draft' || cv.status === 'pending';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl text-gray-900">{t.title}</div>
          
          <div className="flex items-center gap-4">
            <span className="text-gray-700">{t.hello}, Nguyễn Văn A</span>
            
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarFallback className="bg-red-600 text-white">A</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>{t.changePassword}</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>{t.logout}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {cvs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-3xl text-gray-400 mb-6">{t.noCVs}</p>
            <Button onClick={handleOpenCreate} className="bg-red-600 hover:bg-red-700 text-white">
              {t.addCV}
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cvs.map((cv, index) => (
              <motion.div
                key={cv.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-red-600 to-red-700 text-white p-6 rounded-lg shadow-lg"
              >
                <div className="flex justify-between items-start mb-4">
                  {getStatusBadge(cv.status)}
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-sm opacity-90">✉️ {cv.email}</p>
                  <p className="text-sm opacity-90">📁 {cv.projects.length} {t.projectsCount}</p>
                  <p className="text-sm opacity-90">⚡ {cv.skills.length} {t.skillsCount}</p>
                  <p className="text-sm opacity-90">📅 {t.createdDate}: {cv.createdAt}</p>
                </div>
                <div className="flex gap-2">
                  {canEdit(cv) && (
                    <Button
                      onClick={() => handleOpenEdit(cv)}
                      size="sm"
                      className="bg-red-800 hover:bg-red-900 text-white flex-1"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      {t.editCV}
                    </Button>
                  )}
                  {(cv.status === 'accepted' || cv.status === 'rejected') && (
                    <Button
                      onClick={() => setViewingCV(cv)}
                      size="sm"
                      className="bg-red-800 hover:bg-red-900 text-white flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      {t.viewCV}
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
            
            {/* Add New CV Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: cvs.length * 0.1 }}
              onClick={handleOpenCreate}
              className="bg-white border-2 border-dashed border-red-300 hover:border-red-500 p-6 rounded-lg cursor-pointer flex flex-col items-center justify-center text-red-600 hover:text-red-700 transition-all min-h-[200px]"
            >
              <Plus className="w-12 h-12 mb-2" />
              <p>{t.addNewCV}</p>
            </motion.div>
          </div>
        )}
      </div>

      {/* Create/Edit CV Dialog */}
      <Dialog open={isCreating || !!editingCV} onOpenChange={(open) => {
        if (!open) {
          setIsCreating(false);
          setEditingCV(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-red-600">
              {editingCV ? t.editCVTitle : t.createCVTitle}
            </DialogTitle>
            <p className="text-sm text-gray-600">
              {editingCV ? t.editCVSubtitle : t.createCVSubtitle}
            </p>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Personal Info */}
            <div>
              <h3 className="font-semibold mb-3 text-gray-900">{t.personalInfo}</h3>
              <div>
                <Label htmlFor="email">{t.email}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Projects */}
            <div>
              <h3 className="font-semibold mb-3 text-gray-900">{t.projects}</h3>
              <div className="space-y-3">
                {formData.projects.map((project, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder={t.projectName}
                        value={project.name}
                        onChange={(e) => updateProject(index, 'name', e.target.value)}
                      />
                      <Input
                        placeholder={t.projectDescription}
                        value={project.description}
                        onChange={(e) => updateProject(index, 'description', e.target.value)}
                      />
                    </div>
                    {formData.projects.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProject(index)}
                        className="text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addProject}
                  className="w-full"
                >
                  {t.addProject}
                </Button>
              </div>
            </div>

            {/* Skills */}
            <div>
              <h3 className="font-semibold mb-3 text-gray-900">{t.skills}</h3>
              <div className="space-y-2">
                {formData.skills.map((skill, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={t.skills}
                      value={skill}
                      onChange={(e) => updateSkill(index, e.target.value)}
                      className="flex-1"
                    />
                    {formData.skills.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSkill(index)}
                        className="text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSkill}
                  className="w-full"
                >
                  {t.addSkill}
                </Button>
              </div>
            </div>

            {/* Career Goal */}
            <div>
              <Label htmlFor="careerGoal">{t.careerGoal}</Label>
              <Textarea
                id="careerGoal"
                value={formData.careerGoal}
                onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
                className="mt-1"
                rows={3}
              />
            </div>

            {/* Additional Info */}
            <div>
              <Label htmlFor="additionalInfo">{t.additionalInfo}</Label>
              <Textarea
                id="additionalInfo"
                value={formData.additionalInfo}
                onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                className="mt-1"
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => handleSave(true)}
                variant="outline"
                className="flex-1"
              >
                {t.saveDraft}
              </Button>
              <Button
                onClick={() => handleSave(false)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {t.submit}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View CV Dialog */}
      <Dialog open={!!viewingCV} onOpenChange={(open) => !open && setViewingCV(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-red-600">{t.viewCV}</DialogTitle>
          </DialogHeader>
          
          {viewingCV && (
            <div className="space-y-4 py-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{t.personalInfo}</h3>
                <p className="text-gray-700">{viewingCV.email}</p>
              </div>
              
              {viewingCV.projects.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t.projects}</h3>
                  <div className="space-y-2">
                    {viewingCV.projects.map((project, i) => (
                      <div key={i} className="bg-gray-50 p-3 rounded">
                        <p className="font-medium">{project.name}</p>
                        <p className="text-sm text-gray-600">{project.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {viewingCV.skills.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t.skills}</h3>
                  <div className="flex flex-wrap gap-2">
                    {viewingCV.skills.map((skill, i) => (
                      <Badge key={i} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {viewingCV.careerGoal && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t.careerGoal}</h3>
                  <p className="text-gray-700">{viewingCV.careerGoal}</p>
                </div>
              )}
              
              {viewingCV.additionalInfo && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t.additionalInfo}</h3>
                  <p className="text-gray-700">{viewingCV.additionalInfo}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}