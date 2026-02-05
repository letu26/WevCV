import { Button } from '@/app/components/ui/button';
import Preview from '@/components/user/cvpreview/Preview';
import { getCvList } from '@/services/usersservices/CvsServices';
import { useCVLayoutStore } from '@/store/cvLayoutStore';
import { CVBlock, CVLayout, CVSavePayload } from '@/types/cv';
import { Plus } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    close: 'Đóng',
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
    close: 'Close',
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

export default function Profile({ language }: ProfileProps) {
  const t = translations[language];
  const [cvs, setCvs] = useState<CVSavePayload[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewingCv, setViewingCv] = useState<CVSavePayload | null>(null);
  const navigate = useNavigate();
  const { setLayout, resetLayout } = useCVLayoutStore();
  const loadErrorText =
    language === "vi"
      ? "Có lỗi khi tải danh sách CV."
      : "Failed to load CV list.";
  const blocksLabel = language === "vi" ? "khối" : "blocks";
  const parseMaybeJson = <T,>(value: T | string | undefined): T | undefined => {
    if (typeof value !== "string") return value as T | undefined;
    try {
      return JSON.parse(value) as T;
    } catch {
      return undefined;
    }
  };
  const buildLayoutFromPayload = (payload: CVSavePayload): CVLayout => {
    const parsedLayout = parseMaybeJson<CVSavePayload["layout"]>(payload.layout);
    const parsedBlocks =
      parseMaybeJson<CVSavePayload["blocks"]>(payload.blocks) ?? [];

    const blockMap = new Map<string, CVBlock>();
    for (const block of parsedBlocks) {
      if (!block?.id) continue;
      blockMap.set(block.id, {
        id: block.id,
        type: block.type,
        title: block.title,
        data: block.data ?? {},
      });
    }

    const mapIds = (ids?: string[]) =>
      (ids ?? [])
        .map((id) => blockMap.get(id))
        .filter(Boolean) as CVBlock[];

    const left = mapIds(parsedLayout?.left);
    const right = mapIds(parsedLayout?.right);
    const unused = mapIds(parsedLayout?.unused);
    const usedIds = new Set(
      [...left, ...right, ...unused].map((block) => block.id)
    );
    const extras = Array.from(blockMap.values()).filter(
      (block) => !usedIds.has(block.id)
    );

    return {
      left,
      right,
      unused: [...unused, ...extras],
    };
  };

  const openViewModal = (cv: CVSavePayload) => {
    setViewingCv(cv);
    const incomingLayout = buildLayoutFromPayload(cv);
    setLayout(incomingLayout);
  };

  const closeViewModal = () => {
    setViewingCv(null);
    resetLayout();
  };

useEffect(() => {
    if (!viewingCv) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeViewModal();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [viewingCv]);

  useEffect(() => {
    const fetchCvs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getCvList();
        setCvs(response.data ?? []);
      } catch (error) {
        console.error(error);
        setError(loadErrorText);
      } finally {
        setLoading(false);
      }
    };
    fetchCvs();
  }, [loadErrorText])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-900">{t.title}</h1>
          <p className="text-gray-600 mt-1">{t.subtitle}</p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90"
          onClick={() => navigate("/cvs-edit", { state: { mode: "create" } })}
        >
          <Plus className="w-4 h-4 mr-2" />
          {t.addNewCV}
        </Button>
      </div>

      <div className="bg-white border rounded-lg p-4">
        {loading ? (
          <div className="text-gray-500">{t.loading}</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : cvs.length === 0 ? (
          <div className="text-gray-500">{t.noCVs}</div>
        ) : (
          <div className="space-y-3">
            {cvs.map((cv, index) => {
              const title = cv.title?.trim() || `CV ${index + 1}`;
              const parsedBlocks = parseMaybeJson<CVSavePayload["blocks"]>(
                cv.blocks
              );
              const totalBlocks = parsedBlocks?.length ?? 0;
              return (
                <div
                  key={cv.id ?? index}
                  className="flex items-center justify-between border rounded-lg p-4"
                >
                  <div>
                    <div className="text-gray-900 font-semibold">{title}</div>
                    <div className="text-sm text-gray-500">
                      {totalBlocks} {blocksLabel}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => openViewModal(cv)}
                    >
                      {t.viewCV}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() =>
                        navigate("/cvs-edit", {
                          state: { mode: "edit", cv },
                        })
                      }
                    >
                      {t.editCV}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {viewingCv && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto overflow-x-hidden p-6"
          onClick={closeViewModal}
        >
          <div
            className="relative group bg-white w-198.5 max-w-full shadow-xl cv-preview-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div className="text-gray-900 font-semibold">{t.viewCV}</div>
            </div>

            <div className="absolute top-3 right-3 flex items-center gap-2">
              <Button variant="outline" onClick={closeViewModal}>
                {t.close}
              </Button>
            </div>

            <div className="p-6 pointer-events-none select-none cv-preview-readonly">
              <Preview mode="modal" readOnly />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}





