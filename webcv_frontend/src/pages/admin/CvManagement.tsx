import React, { useEffect, useState } from "react";
import {
  getCvs,
  updateCvStatus,
  deleteCv,
  getCvDetail,
  assignUserToCv,
  Cv,
  CvPageResponse,
  CvStatus,
} from "@/services/adminservices/cvs";
import { toast } from "sonner";
import { useSearch } from "@/hooks/useSearch";
import useDebounce from "@/hooks/useDebounce";

const CvManagement: React.FC = () => {
  const { search } = useSearch();
  const debouncedSearch = useDebounce(search, 500);

  const [cvs, setCvs] = useState<CvPageResponse | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [deletedFilter, setDeletedFilter] = useState<boolean | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [detail, setDetail] = useState<Cv | null>(null);
  const [assignUserId, setAssignUserId] = useState<number>();
  const [jumpPage, setJumpPage] = useState<string>("");
  const totalPages = cvs?.totalPages || 1;

  const fetchData = async (
      page: number,
      status?: string,
      deleted?: boolean,
      keyword?: string) => {
    try {
      const data = await getCvs(
        page - 1,
        8,
        status,
        deleted,
        keyword
      );
      const normalized = {
            content: data?.content ?? [],
            totalPages: data?.totalPages ?? 1,
          };

      setCvs(normalized);
    } catch (error) {
      console.error(error);

      setCvs({ content: [], totalPages: 1});
    }
  };

  useEffect(() => {
    fetchData(currentPage, deletedFilter, statusFilter, debouncedSearch);
  }, [currentPage, statusFilter, deletedFilter, debouncedSearch]);

  useEffect(() => {
      setCurrentPage(1);
  }, [statusFilter, deletedFilter, debouncedSearch]);

const handleJump = () => {
    const page = Number(jumpPage);

    if (!page || page < 1 || page > totalPages) return;

    setCurrentPage(page);
    setJumpPage("");
};

const handlePageChange = (page: number) => {
       setCurrentPage(page);
};

const getVisiblePages = () => {
   const pages = [];
   const start = Math.max(1, currentPage - 2);
   const end = Math.min(totalPages, currentPage + 2);

   for (let i = start; i <= end; i++) {
     pages.push(i);
   }

   return pages;
};

const getPagination = () => {
  const pages: (number | string)[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);

    if (currentPage > 4) pages.push("...");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 3) pages.push("...");

    pages.push(totalPages);
  }

  return pages;
};

  const handleStatusChange = async (id: number, status: CvStatus) => {
    await updateCvStatus(id, status);
    toast.success("Cập nhật trạng thái thành công");
    fetchData();
  };

  const handleDelete = async (id: number) => {
    await deleteCv(id);
    toast.success("Xóa CV thành công");
    fetchData();
  };

  const handleViewDetail = async (id: number) => {
    const data = await getCvDetail(id);
    setDetail(data);
  };

  const handleAssignUser = async (cvId: number) => {
    if (!assignUserId) return;
    await assignUserToCv(cvId, assignUserId);
    toast.success("Gán user thành công");
                    fetchData();
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-xl shadow flex justify-between">
        <h1 className="text-2xl font-semibold text-white">
          Quản lý CV
        </h1>

        <div className="flex gap-3">
          <select
            onChange={(e) =>
              setStatusFilter(e.target.value || undefined)
            }
            className="px-3 py-2 rounded bg-white"
          >
            <option value="">Tất cả status</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>

          <select
            onChange={(e) =>
              setDeletedFilter(
                e.target.value === ""
                  ? undefined
                  : e.target.value === "true"
              )
            }
            className="px-3 py-2 rounded bg-white"
          >
            <option value="">Tất cả</option>
            <option value="false">Chưa xóa</option>
            <option value="true">Đã xóa</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Tiêu đề</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4">Deleted</th>
              <th className="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>

          <tbody>
           {Array.isArray(cvs?.content) ? (
             cvs.content.length > 0 ? (

               cvs?.content?.map((cv) => (

                 <tr key={cv?.id ?? Math.random()} className="border-b hover:bg-indigo-50">
                   <td className="px-6 py-4">{cv.id}</td>

                   <td className="px-6 py-4 font-semibold">{cv?.title ?? "N/A"}</td>

                   <td className="px-6 py-4">
                     <span
                       className={`px-3 py-1 rounded-full text-xs ${
                         cv.status === "ACTIVE"
                           ? "bg-green-100 text-green-700"
                           : "bg-red-100 text-red-700"
                       }`}
                     >
                       {cv.status}
                     </span>
                   </td>

                   <td className="px-6 py-4">
                     {cv.deleted ? "Đã xóa" : "Hoạt động"}
                   </td>

                   <td className="px-6 py-4 text-right space-x-2">
                     <button
                       onClick={() =>
                         handleStatusChange(
                           cv.id,
                           cv.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
                         )
                       }
                       className="px-3 py-1 bg-yellow-100 rounded"
                     >
                       Đổi trạng thái
                     </button>

                     <button
                       onClick={() => handleViewDetail(cv.id)}
                       className="px-3 py-1 bg-blue-100 rounded"
                     >
                       Xem
                     </button>

                     <button
                       onClick={() => handleDelete(cv.id)}
                       className="px-3 py-1 bg-red-100 rounded"
                     >
                       Xóa
                     </button>
                   </td>
                 </tr>
               ))
             ) : (
               <tr>
                 <td colSpan={5} className="text-center py-6 text-gray-400">
                   Không có dữ liệu
                 </td>
               </tr>
             )
           ) : null}

          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {detail && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-96 p-6 rounded-xl space-y-4">
            <h2 className="text-lg font-semibold">
              Chi tiết CV #{detail.id}
            </h2>

            <p><b>Tiêu đề:</b> {detail.title}</p>
            <p><b>Status:</b> {detail.status}</p>

            <div>
              <input
                type="number"
                placeholder="Nhập userId để gán"
                onChange={(e) =>
                  setAssignUserId(Number(e.target.value))
                }
                className="w-full border px-3 py-2 rounded"
              />
              <button
                onClick={() => handleAssignUser(detail.id)}
                className="mt-2 w-full bg-indigo-600 text-white py-2 rounded"
              >
                Gán User
              </button>
            </div>

            <button
              onClick={() => setDetail(null)}
              className="w-full border py-2 rounded"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-50">
        <span className="text-sm text-gray-600">
          Trang {currentPage} / {totalPages}
        </span>

        <div className="flex gap-2 items-center">
          {/* Prev */}
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 text-sm rounded-md bg-white border disabled:opacity-50"
          >
            Trước
          </button>

          {/* Pages */}
          {getPagination().map((item, index) => {
            if (item === "...") {
              return <span key={index} className="px-2">...</span>;
            }

            return (
              <button
                key={index}
                onClick={() => setCurrentPage(item as number)}
                className={`px-3 py-1 text-sm rounded-md border ${
                  currentPage === item
                    ? "bg-indigo-600 text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {item}
              </button>
            );
          })}

          {/* Next */}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 text-sm rounded-md bg-white border disabled:opacity-50"
          >
            Sau
          </button>
        </div>

        <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={totalPages}
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              placeholder="Trang..."
              className="w-20 px-2 py-1 border rounded"
            />

            <button
              onClick={handleJump}
              className="px-3 py-1 border rounded bg-blue-500 text-white"
            >
              Go
            </button>
          </div>
      </div>
    </div>
  );
};

export default CvManagement;