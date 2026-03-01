import useDebounce from '@/hooks/useDebounce';
import { useSearch } from '@/hooks/useSearch';
import { getAllCvs } from '@/services/adminservices/cvs';
import { Button } from '@/app/components/ui/button';
import Preview from '@/components/user/cvpreview/Preview';
import { deleteCv } from '@/services/usersservices/CvsServices';
import { useCVLayoutStore } from '@/store/cvLayoutStore';
import { CVBlock, CVLayout, CVSavePayload } from '@/types/cv';
import axios from 'axios';
import { Eye, Trash2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';

const CvManagement: React.FC = () => {
  const { search } = useSearch();
  const debouncedSearch = useDebounce(search, 500);
  const normalizedKeyword = debouncedSearch?.trim() ? debouncedSearch.trim() : null;
  const [status, setStatus] = useState<CVSavePayload['status'] | undefined>(
    undefined
  );
  const [allCvs, setAllCvs] = useState<CVSavePayload[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewingCv, setViewingCv] = useState<CVSavePayload | null>(null);
  const { setLayout, resetLayout } = useCVLayoutStore();

  const PAGE_SIZE = 5;
  const [pageIndex, setPageIndex] = useState(0);
  const [cursorStack, setCursorStack] = useState<number[]>([0]);
  const [currentPageLastId, setCurrentPageLastId] = useState<number | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);

  const currentCursor = cursorStack[pageIndex] ?? 0;

  const filtersRef = useRef<{
    status: CVSavePayload['status'] | undefined;
    keyword: string | null;
  }>({
    status,
    keyword: normalizedKeyword,
  });

  const parseMaybeJson = <T,>(value: T | string | undefined): T | undefined => {
    if (typeof value !== 'string') return value as T | undefined;
    try {
      return JSON.parse(value) as T;
    } catch {
      return undefined;
    }
  };

  const getCvStatusMeta = (cvStatus?: CVSavePayload['status']) => {
    switch (cvStatus) {
      case 'PENDING':
        return {
          label: 'Chờ duyệt',
          className: 'bg-amber-100 text-amber-800 border-amber-200',
        };
      case 'APPROVED':
        return {
          label: 'Đã duyệt',
          className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        };
      case 'REJECTED':
        return {
          label: 'Bị từ chối',
          className: 'bg-rose-100 text-rose-800 border-rose-200',
        };
      default:
        return {
          label: 'Chưa nộp',
          className: 'bg-gray-100 text-gray-800 border-gray-200',
        };
    }
  };

  const getBlockDataByType = (
    blocks: CVSavePayload['blocks'] | undefined,
    type: string
  ): Record<string, unknown> | undefined => {
    if (!blocks) return undefined;
    const found = blocks.find((b) => b?.type === type);
    return (found?.data as Record<string, unknown> | undefined) ?? undefined;
  };

  const buildLayoutFromPayload = (payload: CVSavePayload): CVLayout => {
    const parsedLayout = parseMaybeJson<CVSavePayload['layout']>(payload.layout);
    const parsedBlocks =
      parseMaybeJson<CVSavePayload['blocks']>(payload.blocks) ?? [];

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
      if (event.key === 'Escape') {
        closeViewModal();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [viewingCv]);

  const handleDeleteCv = async (id: CVSavePayload['id']) => {
    if (!id) return;

    const result = await Swal.fire({
      title: 'Bạn chắc chắn muốn xóa?',
      text: 'CV sẽ bị xóa vĩnh viễn và không thể khôi phục!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteCv(Number(id));

      if (response.code === '200') {
        const deletedId = Number(id);
        Swal.fire({
          icon: 'success',
          title: 'Đã xóa!',
          text: 'CV đã được xóa',
          timer: 1500,
          showConfirmButton: false,
        });

        setAllCvs((prev) => prev.filter((cv) => Number(cv.id) !== deletedId));
      }
    } catch (deleteError) {
      if (axios.isAxiosError(deleteError)) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text:
            deleteError.response?.data?.message ||
            'Có lỗi xảy ra, vui lòng thử lại',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi không xác định',
          text: 'Vui lòng thử lại sau',
        });
      }
    }
  };

  useEffect(() => {
    const prev = filtersRef.current;
    const filtersChanged =
      prev.status !== status || prev.keyword !== normalizedKeyword;

    if (filtersChanged) {
      filtersRef.current = { status, keyword: normalizedKeyword };
      setCurrentPageLastId(null);
      setHasNextPage(false);

      const needsReset =
        pageIndex !== 0 || cursorStack.length !== 1 || cursorStack[0] !== 0;
      if (needsReset) {
        setPageIndex(0);
        setCursorStack([0]);
        return;
      }
    }

    const fetchCvs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllCvs(
          currentCursor,
          PAGE_SIZE,
          status || null,
          normalizedKeyword
        );
        const data = response.data ?? [];
        setAllCvs(data);

        const lastRowIdRaw = data.length > 0 ? data[data.length - 1]?.id : null;
        const lastRowId =
          lastRowIdRaw === null || lastRowIdRaw === undefined
            ? null
            : Number(lastRowIdRaw);
        const safeLastId =
          lastRowId !== null && Number.isFinite(lastRowId) ? lastRowId : null;
        setCurrentPageLastId(safeLastId);
        setHasNextPage(safeLastId !== null && data.length === PAGE_SIZE);
      } catch (error) {
        console.error('Error fetching CVs:', error);
        setError('Có lỗi khi tải danh sách CV.');
      } finally {
        setLoading(false);
      }
    };
    fetchCvs();
  }, [status, normalizedKeyword, currentCursor]);

  const labelId = 'Mã';
  const labelLayout = 'Bố cục';
  const labelLeft = 'Trái';
  const labelRight = 'Phải';
  const labelAvatar = 'Ảnh';
  const labelAvatarYes = 'Có';
  const labelAvatarNo = 'Chưa';

  const canGoPrev = !loading && pageIndex > 0;
  const canGoNext =
    !loading && (pageIndex + 1 < cursorStack.length || hasNextPage);

  const goPrevPage = () => {
    if (!canGoPrev) return;
    setPageIndex((prev) => Math.max(0, prev - 1));
  };

  const goNextPage = () => {
    if (!canGoNext) return;

    if (pageIndex + 1 < cursorStack.length) {
      setPageIndex((prev) => prev + 1);
      return;
    }

    if (currentPageLastId === null) return;

    setCursorStack((prev) => [...prev, currentPageLastId]);
    setPageIndex((prev) => prev + 1);
  };

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="mb-6 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 p-6 flex flex-col gap-4 shadow
                md:flex-row md:items-center md:justify-between">

          {/* Title */}
          <h1 className="text-2xl font-semibold text-white">
            Quản lý CV
          </h1>

          {/* Filters + Action */}
          <div className="flex flex-wrap items-center gap-3">

            {/* Filter Status */}
            <select
              value={status ?? ""}
              onChange={(e) => {
                setStatus(
                  (e.target.value as CVSavePayload['status']) || undefined
                );
              }}
              className="px-4 py-2 rounded-lg bg-white/90 text-gray-700
                 focus:outline-none focus:ring-2 focus:ring-white
                 cursor-pointer"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="PENDING">PENDING</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4">
          {loading ? (
            <div className="text-gray-500">Đang tải...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : allCvs.length === 0 ? (
            <div className="text-gray-500">Hiện không có CV nào</div>
          ) : (
            <div className="space-y-3">
              {allCvs.map((cv, index) => {
                const title = cv.title?.trim() || `CV ${index + 1}`;
                const parsedLayout = parseMaybeJson<CVSavePayload['layout']>(
                  cv.layout
                );
                const parsedBlocks =
                  parseMaybeJson<CVSavePayload['blocks']>(cv.blocks) ?? [];

                const leftCount = parsedLayout?.left?.length ?? 0;
                const rightCount = parsedLayout?.right?.length ?? 0;

                const business = getBlockDataByType(parsedBlocks, 'businesscard');
                const fullName = String(business?.fullName ?? '').trim();
                const position = String(business?.position ?? '').trim();

                const avatar = getBlockDataByType(parsedBlocks, 'avatar');
                const avatarUrl = String(avatar?.image ?? '').trim();
                const hasAvatar = Boolean(avatarUrl);
                const statusMeta = getCvStatusMeta(cv.status);

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
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusMeta.className}`}
                            >
                              {statusMeta.label}
                            </span>
                          </div>

                          {(fullName || position) && (
                            <div className="text-sm text-gray-700 mt-1">
                              <span className="font-medium">
                                {fullName || '-'}
                              </span>
                              {position ? (
                                <span className="text-gray-500">
                                  {' '}
                                  · {position}
                                </span>
                              ) : null}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                        <span className="px-2 py-1 rounded-md bg-gray-50 border">
                          {labelId}: {cv.id ?? '-'}
                        </span>
                        <span className="px-2 py-1 rounded-md bg-gray-50 border">
                          {labelLayout}: {labelLeft} {leftCount} / {labelRight}{' '}
                          {rightCount}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-md border ${
                            hasAvatar
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-gray-50'
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
                        title="Xem CV"
                        aria-label="Xem CV"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="sr-only">Xem CV</span>
                      </Button>
                      <Button
                        onClick={() => handleDeleteCv(cv.id)}
                        variant="destructive"
                        size="icon"
                        className="transition-colors duration-500 hover:bg-destructive/80"
                        title="Xóa CV"
                        aria-label="Xóa CV"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="sr-only">Xóa CV</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && !error && (allCvs.length > 0 || pageIndex > 0) ? (
            <div className="mt-4 flex items-center justify-between gap-3">
              <Button variant="outline" onClick={goPrevPage} disabled={!canGoPrev}>
                Trang trước
              </Button>

              <div className="text-sm text-gray-600">
                Trang {pageIndex + 1}
              </div>

              <Button variant="outline" onClick={goNextPage} disabled={!canGoNext}>
                Trang sau
              </Button>
            </div>
          ) : null}
        </div>
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
              <div className="text-gray-900 font-semibold">Xem CV</div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={closeViewModal}>
                  Đóng
                </Button>
              </div>
            </div>

            <div className="p-6 pointer-events-none select-none cv-preview-readonly">
              <Preview mode="modal" readOnly />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CvManagement;