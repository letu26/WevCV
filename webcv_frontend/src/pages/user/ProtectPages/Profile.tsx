import { Button } from '@/app/components/ui/button';
import Preview from '@/components/user/cvpreview/Preview';
import { createCvPdfJob, deleteCv, downloadPdfJob, getCvList, getCvShareLink, getPdfJob, updateCvVisibility } from '@/services/usersservices/CvsServices';
import { useCVLayoutStore } from '@/store/cvLayoutStore';
import { CVBlock, CVLayout, CVSavePayload } from '@/types/cv';
import axios from 'axios';
import { Edit, Eye, LucideShare2, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Swal from "sweetalert2";

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
    exportPdf: 'Xuất PDF',
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
    exportPdf: 'Export PDF',
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
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [sharingCv, setSharingCv] = useState<CVSavePayload | null>(null);
  const [shareAccess, setShareAccess] = useState<string>();
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
  void blocksLabel;
  const statusNotReviewed = language === "vi" ? "Chưa duyệt" : "Not reviewed";
  const labelId = language === "vi" ? "Mã" : "ID";
  const labelLayout = language === "vi" ? "Bố cục" : "Layout";
  const labelLeft = language === "vi" ? "Trái" : "Left";
  const labelRight = language === "vi" ? "Phải" : "Right";
  const labelAvatar = language === "vi" ? "Ảnh" : "Avatar";
  const labelAvatarYes = language === "vi" ? "Có" : "Yes";
  const labelAvatarNo = language === "vi" ? "Chưa" : "No";

  const getBlockDataByType = (
    blocks: CVSavePayload["blocks"] | undefined,
    type: string
  ): Record<string, unknown> | undefined => {
    if (!blocks) return undefined;
    const found = blocks.find((b) => b?.type === type);
    return (found?.data as Record<string, unknown> | undefined) ?? undefined;
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

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleExportPdf = async () => {
    if (!viewingCv?.id) {
      toast.error("Không tìm thấy CV để xuất.");
      return;
    }
    try {
      toast("Đang tạo PDF...");
      const jobResponse = await createCvPdfJob(String(viewingCv.id));
      const jobId = jobResponse?.data?.jobId;
      if (!jobId) {
        toast.error("Xuất PDF thất bại.");
        return;
      }

      const maxPolls = 20;
      const delayMs = 5000;
      for (let attempt = 0; attempt < maxPolls; attempt += 1) {
        const jobStatus = await getPdfJob(jobId);
        const status = jobStatus?.data?.status;
        if (status === "DONE") {
          const blob = await downloadPdfJob(jobId);
          if (!blob || blob.size === 0) {
            toast.error("Xuất PDF thất bại (file rỗng).");
            return;
          }
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          const safeTitle = (viewingCv.title || `cv-${viewingCv.id}`)
            .trim()
            .replace(/\s+/g, "-");
          link.href = url;
          link.download = `${safeTitle || `cv-${viewingCv.id}`}.pdf`;
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
          toast.success("Đã xuất PDF.");
          return;
        }

        if (status === "FAILED") {
          const errorMessage = jobStatus?.data?.error;
          toast.error(errorMessage ? `Xuất PDF thất bại: ${errorMessage}` : "Xuất PDF thất bại.");
          return;
        }

        await sleep(delayMs);
      }

      toast.error("Xuất PDF thất bại (quá thời gian).");
    } catch (error) {
      console.error(error);
      toast.error("Xuất PDF thất bại.");
    }
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

  const handleDeleteCv = async (id) => {
    const result = await Swal.fire({
      title: "Bạn chắc chắn muốn xóa?",
      text: "CV sẽ bị xóa vĩnh viễn và không thể khôi phục!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteCv(id);

      if (response.code === "200") {
        Swal.fire({
          icon: "success",
          title: "Đã xóa!",
          text: t.cvDeleted,
          timer: 1500,
          showConfirmButton: false,
        });

        setCvs((prev) => prev.filter((cv) => cv.id !== id));
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text:
            error.response?.data?.message ||
            "Có lỗi xảy ra, vui lòng thử lại",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Lỗi không xác định",
          text: "Vui lòng thử lại sau",
        });
      }
    }
  };


  const handleShowShare = async (cv: CVSavePayload) => {
    try {
      if (!cv?.id) return;
      const response = await getCvShareLink(cv.id);
      setShareLink(response.data);
      setSharingCv(cv);
      setIsShareModalOpen(true);
    } catch (error) {
      console.error(error);
      toast.error("Lấy link chia sẻ thất bại.");
    }
  };

  const closeShareModal = () => {
    setIsShareModalOpen(false);
    setSharingCv(null);
  };

  const handleCopyShare = async () => {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      toast.success("Đã copy link.");
    } catch (error) {
      console.error(error);
      toast.error("Copy link thất bại.");
    }
  };
  const handleChangeAccess = async (cvId, visibility: string) => {
    const currentVisibility =
      sharingCv?.id === cvId
        ? String(sharingCv.visibility ?? "")
        : String(cvs.find((cv) => cv.id === cvId)?.visibility ?? "");

    const result = await Swal.fire({
      title: "Cập nhật quyền truy cập?",
      text: `Bạn muốn đổi quyền truy cập sang ${visibility}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Cập nhật",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#aaa",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await updateCvVisibility({ cvId, visibility });
      if (response.code === "200") {
        setShareAccess(visibility);
        setSharingCv((prev) =>
          prev && prev.id === cvId ? { ...prev, visibility } : prev
        );
        setCvs((prev) =>
          prev.map((cv) => (cv.id === cvId ? { ...cv, visibility } : cv))
        );
        Swal.fire({
          icon: "success",
          title: "Đã cập nhật!",
          text: `Quyền truy cập đã chuyển sang ${visibility}.`,
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        throw new Error(response.message || "Cập nhật thất bại");
      }
    } catch (error) {
      console.error(error);
      setSharingCv((prev) =>
        prev && prev.id === cvId ? { ...prev, visibility: currentVisibility } : prev
      );
      setCvs((prev) =>
        prev.map((cv) =>
          cv.id === cvId ? { ...cv, visibility: currentVisibility } : cv
        )
      );
      Swal.fire({
        icon: "error",
        title: "Cập nhật thất bại",
        text: "Vui lòng thử lại.",
      });
    }
  };
  
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
              const parsedLayout = parseMaybeJson<CVSavePayload["layout"]>(
                cv.layout
              );
              const parsedBlocks =
                parseMaybeJson<CVSavePayload["blocks"]>(cv.blocks) ?? [];

              const leftCount = parsedLayout?.left?.length ?? 0;
              const rightCount = parsedLayout?.right?.length ?? 0;

              const business = getBlockDataByType(parsedBlocks, "businesscard");
              const fullName = String(business?.fullName ?? "").trim();
              const position = String(business?.position ?? "").trim();

              const avatar = getBlockDataByType(parsedBlocks, "avatar");
              const avatarUrl = String(avatar?.image ?? "").trim();
              const hasAvatar = Boolean(avatarUrl);
              return (
                <div
                  key={cv.id ?? index}
                  className="flex items-start justify-between border rounded-xl p-4 bg-white hover:shadow-sm hover:border-gray-300 transition"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt="Avatar"
                          className="w-10 h-10 rounded-full object-cover border"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-100 border flex items-center justify-center text-xs font-semibold text-gray-500">
                          CV
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2">
                          <div className="text-gray-900 font-semibold">
                            {title}
                          </div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                            {statusNotReviewed}
                          </span>
                        </div>

                        {(fullName || position) && (
                          <div className="text-sm text-gray-700 mt-1">
                            <span className="font-medium">
                              {fullName || "-"}
                            </span>
                            {position ? (
                              <span className="text-gray-500">
                                {" "}
                                · {position}
                              </span>
                            ) : null}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                      <span className="px-2 py-1 rounded-md bg-gray-50 border">
                        {labelId}: {cv.id ?? "-"}
                      </span>
                      <span className="px-2 py-1 rounded-md bg-gray-50 border">
                        {labelLayout}: {labelLeft} {leftCount} / {labelRight}{" "}
                        {rightCount}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-md border ${hasAvatar
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-gray-50"
                          }`}
                      >
                        {labelAvatar}: {hasAvatar ? labelAvatarYes : labelAvatarNo}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openViewModal(cv)}
                      title={t.viewCV}
                      aria-label={t.viewCV}
                    >
                      <Eye className="w-4 h-4" />
                      <span className="sr-only">{t.viewCV}</span>
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="transition-colors duration-500 hover:bg-yellow-100"
                      onClick={() =>
                        navigate("/cvs-edit", {
                          state: { mode: "edit", cv },
                        })
                      }
                      title={t.editCV}
                      aria-label={t.editCV}
                    >
                      <Edit className="w-4 h-4" />
                      <span className="sr-only">{t.editCV}</span>
                    </Button>
                    <Button
                      className="border border-blue-500 text-blue-500 bg-white hover:bg-blue-50"
                      onClick={() => handleShowShare(cv)}
                      title="Quản lý chia sẻ CV"
                      aria-label="Quản lý chia sẻ CV"
                    >
                      <LucideShare2 />
                    </Button>
                    <Button
                      onClick={() => handleDeleteCv(cv.id)}
                      variant="destructive"
                      size="icon"
                      className="transition-colors duration-500 hover:bg-destructive/80"
                      title={t.deleteCV}
                      aria-label={t.deleteCV}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="sr-only">{t.deleteCV}</span>
                    </Button>
                  </div>
                  {isShareModalOpen && sharingCv?.id === cv.id && (
                    <div
                      className="fixed inset-0 z-50 bg-black/5 flex items-center justify-center overflow-y-auto overflow-x-hidden p-6"
                      onClick={closeShareModal}
                    >
                      <div
                        className="relative group bg-white w-full max-w-lg shadow-xl rounded-xl"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <div className="flex items-center justify-between px-6 py-4 border-b">
                          <div className="text-gray-900 font-semibold">Quản lý chia sẻ cv</div>
                          <Button variant="outline" onClick={closeShareModal}>
                            {t.close}
                          </Button>
                        </div>

                        <div className="p-6 space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Link chia sẻ
                            </label>
                            <div className="mt-1 flex items-center gap-2">
                              <input
                                value={shareLink}
                                onChange={(event) => setShareLink(event.target.value)}
                                placeholder="Nhập link chia sẻ"
                                className="h-10 w-full rounded-md border bg-white px-3 text-sm text-gray-900 outline-none"
                              />
                              <Button variant="outline" onClick={handleCopyShare}>
                                Copy
                              </Button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Quyền truy cập
                            </label>
                            <select
                              value={(sharingCv?.visibility ?? "PRIVATE").toUpperCase().trim()}
                              onChange={(event) =>
                                handleChangeAccess(
                                  cv.id,
                                  event.target.value as string
                                )
                              }
                              className="mt-1 h-10 w-full rounded-md border bg-white px-3 text-sm text-gray-900 outline-none"
                            >
                              <option value="PRIVATE">PRIVATE</option>
                              <option value="PUBLIC">PUBLIC</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleExportPdf}>
                  {t.exportPdf}
                </Button>
                <Button variant="outline" onClick={closeViewModal}>
                  {t.close}
                </Button>
              </div>
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
