import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { motion } from 'motion/react';
import { Plus, Edit, Eye, X, FileText, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import React from 'react';
import { CV, Project } from '@/types/UserType';

interface ProfileProps {
  language: 'vi' | 'en';
}

const translations = {
  vi: {
    title: 'Quản lý CV',
    subtitle: 'Tạo và quản lý CV ứng tuyển của bạn',
    noCVs: 'Hiện không có CV nào',
    addCVDescription: 'Tạo CV chuyên nghiệp để ứng tuyển vào Viettel Software',
    addNewCV: 'Tạo CV mới',
    editCV: 'Chỉnh sửa',
    viewCV: 'Xem',
    deleteCV: 'Xóa',
    createCVTitle: 'Tạo CV mới',
    editCVTitle: 'Chỉnh sửa CV',
    viewCVTitle: 'Xem CV',
    personalInfo: 'Thông tin cá nhân',
    email: 'Email',
    fullName: 'Họ và tên',
    phone: 'Số điện thoại',
    address: 'Địa chỉ',
    education: 'Học vấn',
    experience: 'Kinh nghiệm',
    projects: 'Dự án đã tham gia',
    projectName: 'Tên dự án',
    projectDescription: 'Mô tả dự án',
    role: 'Vai trò',
    technologies: 'Công nghệ sử dụng (phân cách bằng dấu phẩy)',
    addProject: 'Thêm dự án',
    removeProject: 'Xóa',
    skills: 'Kỹ năng',
    skillInput: 'Nhập kỹ năng',
    addSkill: 'Thêm',
    careerGoal: 'Mục tiêu nghề nghiệp',
    additionalInfo: 'Thông tin bổ sung',
    saveDraft: 'Lưu nháp',
    submit: 'Gửi duyệt',
    cancel: 'Hủy',
    save: 'Lưu',
    statusDraft: 'Bản nháp',
    statusPending: 'Chờ duyệt',
    statusAccepted: 'Đã chấp nhận',
    statusRejected: 'Đã từ chối',
    projectsCount: 'dự án',
    skillsCount: 'kỹ năng',
    createdDate: 'Ngày tạo',
    cvSaved: 'CV đã được lưu thành công',
    cvSubmitted: 'CV đã được gửi thành công',
    cvDeleted: 'CV đã được xóa',
    confirmDelete: 'Bạn có chắc muốn xóa CV này?',
    loading: 'Đang tải...',
  },
  en: {
    title: 'CV Management',
    subtitle: 'Create and manage your application CVs',
    noCVs: 'No CVs available',
    addCVDescription: 'Create a professional CV to apply to Viettel Software',
    addNewCV: 'Create New CV',
    editCV: 'Edit',
    viewCV: 'View',
    deleteCV: 'Delete',
    createCVTitle: 'Create New CV',
    editCVTitle: 'Edit CV',
    viewCVTitle: 'View CV',
    personalInfo: 'Personal Information',
    email: 'Email',
    fullName: 'Full Name',
    phone: 'Phone Number',
    address: 'Address',
    education: 'Education',
    experience: 'Experience',
    projects: 'Projects',
    projectName: 'Project Name',
    projectDescription: 'Project Description',
    role: 'Role',
    technologies: 'Technologies (comma separated)',
    addProject: 'Add Project',
    removeProject: 'Remove',
    skills: 'Skills',
    skillInput: 'Enter skill',
    addSkill: 'Add',
    careerGoal: 'Career Goal',
    additionalInfo: 'Additional Information',
    saveDraft: 'Save Draft',
    submit: 'Submit for Review',
    cancel: 'Cancel',
    save: 'Save',
    statusDraft: 'Draft',
    statusPending: 'Pending',
    statusAccepted: 'Accepted',
    statusRejected: 'Rejected',
    projectsCount: 'projects',
    skillsCount: 'skills',
    createdDate: 'Created',
    cvSaved: 'CV saved successfully',
    cvSubmitted: 'CV submitted successfully',
    cvDeleted: 'CV deleted',
    confirmDelete: 'Are you sure you want to delete this CV?',
    loading: 'Loading...',
  },
};

const getStatusColor = (status: CV['status']) => {
  switch (status) {
    case 'draft': return 'bg-gray-100 text-gray-700';
    case 'pending': return 'bg-yellow-100 text-yellow-700';
    case 'accepted': return 'bg-green-100 text-green-700';
    case 'rejected': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getStatusText = (status: CV['status'], t: typeof translations.vi) => {
  switch (status) {
    case 'draft': return t.statusDraft;
    case 'pending': return t.statusPending;
    case 'accepted': return t.statusAccepted;
    case 'rejected': return t.statusRejected;
    default: return t.statusDraft;
  }
};

export default function Profile({ language }: ProfileProps) {
  const t = translations[language];
  const [cvs, setCvs] = useState<CV[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'create' | 'edit' | 'view'>('create');
  const [currentCV, setCurrentCV] = useState<CV | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phone: '',
    address: '',
    education: '',
    experience: '',
    projects: [] as Project[],
    skills: [] as string[],
    careerGoal: '',
    additionalInfo: '',
  });

  const [newProject, setNewProject] = useState({ name: '', description: '', role: '', technologies: '' });
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    loadCVs();
  }, []);

  const loadCVs = async () => {
    try {
      // Uncomment when backend is ready:
      // const response = await cvService.listCVs();
      // if (response.success && response.data) {
      //   setCvs(response.data);
      // }

      // Mock data for development
      const mockCVs: CV[] = [
        {
          id: '1',
          userId: '1',
          email: 'user@example.com',
          fullName: 'Nguyễn Văn A',
          phone: '0123456789',
          projects: [
            { name: 'E-commerce Platform', description: 'Built a scalable e-commerce platform', role: 'Frontend Developer', technologies: ['React', 'TypeScript'] }
          ],
          skills: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
          status: 'draft',
          createdAt: '2025-01-15',
          careerGoal: 'Become a senior full-stack developer',
        },
        {
          id: '2',
          userId: '1',
          email: 'user@example.com',
          fullName: 'Nguyễn Văn A',
          phone: '0123456789',
          projects: [
            { name: 'Mobile Banking App', description: 'Developed mobile banking application', role: 'Mobile Developer', technologies: ['React Native', 'Firebase'] }
          ],
          skills: ['React Native', 'Firebase', 'Redux'],
          status: 'pending',
          createdAt: '2025-01-10',
        },
      ];
      setCvs(mockCVs);
    } catch (error) {
      console.error('Failed to load CVs:', error);
      toast.error('Failed to load CVs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    const userStr = localStorage.getItem('user');
    let userEmail = '';
    let userFullName = '';
    let userPhone = '';

    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        userEmail = user.email || '';
        userFullName = user.fullName || '';
        userPhone = user.phone || '';
      } catch (e) {
        console.error('Failed to parse user data');
      }
    }

    setFormData({
      email: userEmail,
      fullName: userFullName,
      phone: userPhone,
      address: '',
      education: '',
      experience: '',
      projects: [],
      skills: [],
      careerGoal: '',
      additionalInfo: '',
    });
    setViewMode('create');
    setCurrentCV(null);
    setDialogOpen(true);
  };

  const handleEdit = (cv: CV) => {
    setFormData({
      email: cv.email,
      fullName: cv.fullName || '',
      phone: cv.phone || '',
      address: cv.address || '',
      education: cv.education || '',
      experience: cv.experience || '',
      projects: cv.projects,
      skills: cv.skills,
      careerGoal: cv.careerGoal || '',
      additionalInfo: cv.additionalInfo || '',
    });
    setViewMode('edit');
    setCurrentCV(cv);
    setDialogOpen(true);
  };

  const handleView = (cv: CV) => {
    setFormData({
      email: cv.email,
      fullName: cv.fullName || '',
      phone: cv.phone || '',
      address: cv.address || '',
      education: cv.education || '',
      experience: cv.experience || '',
      projects: cv.projects,
      skills: cv.skills,
      careerGoal: cv.careerGoal || '',
      additionalInfo: cv.additionalInfo || '',
    });
    setViewMode('view');
    setCurrentCV(cv);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t.confirmDelete)) return;

    try {
      // Uncomment when backend is ready:
      // await cvService.deleteCV(id);

      setCvs(cvs.filter(cv => cv.id !== id));
      toast.success(t.cvDeleted);
    } catch (error) {
      console.error('Failed to delete CV:', error);
      toast.error('Failed to delete CV');
    }
  };

  const handleAddProject = () => {
    if (!newProject.name || !newProject.description) {
      toast.error(language === 'vi' ? 'Vui lòng điền đầy đủ thông tin dự án' : 'Please fill in all project information');
      return;
    }

    const project: Project = {
      name: newProject.name,
      description: newProject.description,
      role: newProject.role,
      technologies: newProject.technologies ? newProject.technologies.split(',').map(t => t.trim()) : undefined,
    };

    setFormData({
      ...formData,
      projects: [...formData.projects, project],
    });
    setNewProject({ name: '', description: '', role: '', technologies: '' });
  };

  const handleRemoveProject = (index: number) => {
    setFormData({
      ...formData,
      projects: formData.projects.filter((_, i) => i !== index),
    });
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;

    if (formData.skills.includes(newSkill.trim())) {
      toast.error(language === 'vi' ? 'Kỹ năng đã tồn tại' : 'Skill already exists');
      return;
    }

    setFormData({
      ...formData,
      skills: [...formData.skills, newSkill.trim()],
    });
    setNewSkill('');
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skill),
    });
  };

  const handleSaveDraft = async () => {
    try {
      const cvData = {
        ...formData,
        status: 'draft' as const,
      };

      if (viewMode === 'edit' && currentCV) {
        // Uncomment when backend is ready:
        // await cvService.updateCV({ ...cvData, id: currentCV.id });
        setCvs(cvs.map(cv => cv.id === currentCV.id ? { ...cv, ...cvData } : cv));
      } else {
        // Uncomment when backend is ready:
        // await cvService.createCV(cvData);
        const newCV: CV = {
          ...cvData,
          id: Date.now().toString(),
          userId: '1',
          status: 'draft',
          createdAt: new Date().toISOString().split('T')[0],
        };
        setCvs([...cvs, newCV]);
      }

      toast.success(t.cvSaved);
      setDialogOpen(false);
    } catch (error) {
      console.error('Failed to save CV:', error);
      toast.error('Failed to save CV');
    }
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.fullName) {
      toast.error(language === 'vi' ? 'Vui lòng điền đầy đủ thông tin cá nhân' : 'Please fill in personal information');
      return;
    }

    try {
      const cvData = {
        ...formData,
        status: 'pending' as const,
      };

      if (viewMode === 'edit' && currentCV) {
        // Uncomment when backend is ready:
        // await cvService.updateCV({ ...cvData, id: currentCV.id });
        setCvs(cvs.map(cv => cv.id === currentCV.id ? { ...cv, ...cvData } : cv));
      } else {
        // Uncomment when backend is ready:
        // await cvService.createCV(cvData);
        const newCV: CV = {
          ...cvData,
          id: Date.now().toString(),
          userId: '1',
          status: 'pending',
          createdAt: new Date().toISOString().split('T')[0],
        };
        setCvs([...cvs, newCV]);
      }

      toast.success(t.cvSubmitted);
      setDialogOpen(false);
    } catch (error) {
      console.error('Failed to submit CV:', error);
      toast.error('Failed to submit CV');
    }
  };

  const isReadOnly = viewMode === 'view';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-900">{t.title}</h1>
          <p className="text-gray-600 mt-1">{t.subtitle}</p>
        </div>
        <Button onClick={handleCreateNew} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          {t.addNewCV}
        </Button>
      </div>

      {/* CVs List */}
      {cvs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl text-gray-600 mb-2">{t.noCVs}</h3>
            <p className="text-gray-500 mb-6 text-center max-w-md">{t.addCVDescription}</p>
            <Button onClick={handleCreateNew} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              {t.addNewCV}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {cvs.map((cv, index) => (
            <motion.div
              key={cv.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle>{cv.fullName || cv.email}</CardTitle>
                        <Badge className={getStatusColor(cv.status)}>
                          {getStatusText(cv.status, t)}
                        </Badge>
                      </div>
                      <CardDescription>
                        {cv.email} • {cv.projects.length} {t.projectsCount} • {cv.skills.length} {t.skillsCount}
                      </CardDescription>
                      <p className="text-sm text-gray-500 mt-1">
                        {t.createdDate}: {cv.createdAt}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleView(cv)}>
                        <Eye className="w-4 h-4 mr-1" />
                        {t.viewCV}
                      </Button>
                      {cv.status === 'draft' && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => handleEdit(cv)}>
                            <Edit className="w-4 h-4 mr-1" />
                            {t.editCV}
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(cv.id)} className="text-primary hover:text-primary/80">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                {cv.careerGoal && (
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-2">{cv.careerGoal}</p>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* CV Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {viewMode === 'create' && t.createCVTitle}
              {viewMode === 'edit' && t.editCVTitle}
              {viewMode === 'view' && t.viewCVTitle}
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">{t.personalInfo}</TabsTrigger>
              <TabsTrigger value="projects">{t.projects}</TabsTrigger>
              <TabsTrigger value="skills">{t.skills}</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">{t.fullName}</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    disabled={isReadOnly}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">{t.email}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={isReadOnly}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">{t.phone}</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={isReadOnly}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="address">{t.address}</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    disabled={isReadOnly}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="education">{t.education}</Label>
                <Textarea
                  id="education"
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  disabled={isReadOnly}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="experience">{t.experience}</Label>
                <Textarea
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  disabled={isReadOnly}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="careerGoal">{t.careerGoal}</Label>
                <Textarea
                  id="careerGoal"
                  value={formData.careerGoal}
                  onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
                  disabled={isReadOnly}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="additionalInfo">{t.additionalInfo}</Label>
                <Textarea
                  id="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                  disabled={isReadOnly}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </TabsContent>

            <TabsContent value="projects" className="space-y-4 mt-4">
              {!isReadOnly && (
                <Card className="bg-accent/50">
                  <CardContent className="pt-6 space-y-4">
                    <div>
                      <Label htmlFor="projectName">{t.projectName}</Label>
                      <Input
                        id="projectName"
                        value={newProject.name}
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">{t.role}</Label>
                      <Input
                        id="role"
                        value={newProject.role}
                        onChange={(e) => setNewProject({ ...newProject, role: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="technologies">{t.technologies}</Label>
                      <Input
                        id="technologies"
                        value={newProject.technologies}
                        onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                        className="mt-1"
                        placeholder="React, TypeScript, Node.js"
                      />
                    </div>
                    <div>
                      <Label htmlFor="projectDescription">{t.projectDescription}</Label>
                      <Textarea
                        id="projectDescription"
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    <Button onClick={handleAddProject} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      {t.addProject}
                    </Button>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-3">
                {formData.projects.map((project, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{project.name}</h4>
                          {project.role && <p className="text-sm text-primary mt-1">{project.role}</p>}
                          {project.technologies && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {project.technologies.map((tech, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <p className="text-sm text-gray-600 mt-2">{project.description}</p>
                        </div>
                        {!isReadOnly && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveProject(index)}
                            className="text-primary hover:text-primary/80"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="skills" className="space-y-4 mt-4">
              {!isReadOnly && (
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder={t.skillInput}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                  />
                  <Button onClick={handleAddSkill}>
                    <Plus className="w-4 h-4 mr-2" />
                    {t.addSkill}
                  </Button>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                    {skill}
                    {!isReadOnly && (
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-2 hover:text-primary"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {!isReadOnly && (
            <div className="flex justify-end gap-2 mt-6 pt-6 border-t">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                {t.cancel}
              </Button>
              <Button variant="outline" onClick={handleSaveDraft}>
                {t.saveDraft}
              </Button>
              <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
                {t.submit}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
