import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { AiTwotoneEye } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useSearch } from "@/hooks/useSearch";
import useDebounce from "@/hooks/useDebounce";

import {
  getAllCvs,
  getCvByUserId,
  CvResponse,
  CvPageResponse,
  CvStatus,
} from "@/services/leadservice/lead.api";
import CvDetailDialog from "@/app/components/leadComponents/CvDetailDialog";

const ManageCv: React.FC = () => {
  const { search } = useSearch();
  const debouncedSearch = useDebounce(search, 500);

  const [cvs, setCvs] = useState<CvPageResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState<CvStatus | undefined>();
  const [selectedCv, setSelectedCv] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);

  const navigate = useNavigate();

  const totalPages = cvs?.totalPages ?? 1;

  /* ================= FETCH ================= */
  const fetchCvs = async () => {
    try {
      const data = await getAllCvs(currentPage - 1, 8, status, debouncedSearch);
      setCvs(data);
      console.log(data.content);
    } catch {
      toast.error("Không tải được danh sách CV");
    }
  };

  useEffect(() => {
    fetchCvs();
  }, [currentPage, status, debouncedSearch]);

  /* ================= DETAIL ================= */

  
  const openDetail = async (userId: number) => {
    try {
      const res = await getCvByUserId(userId);
      setSelectedCv(res.data);
      setShowDetail(true);
      
    } catch {
      toast.error("Không tải được chi tiết CV");
    }
  };

  return (
    <>
      <div className="p-6">
        {/* HEADER */}
        <div
          className="mb-6 rounded-xl bg-gradient-to-r from-red-600 to-red-700 p-6
          flex flex-col gap-4 md:flex-row md:justify-between md:items-center"
        >
          <h1 className="text-2xl font-semibold text-white">Quản lý CV</h1>

          <select
            value={status ?? ""}
            onChange={(e) =>
              setStatus(
                e.target.value ? (e.target.value as CvStatus) : undefined,
              )
            }
            className="px-4 py-2 rounded-lg"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="BLOCKED">BLOCKED</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left">ID</th>
                <th className="px-6 py-4 text-left">Title</th>
                <th className="px-6 py-4 text-left">FullName</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {cvs?.content.map((cv: CvResponse) => (
                <tr key={cv.id} className="hover:bg-red-50">
                  <td className="px-6 py-3">{cv.id}</td>
                  <td className="px-6 py-3 font-semibold">{cv.title}</td>
                  <td className="px-6 py-3">{cv.fullName}</td>

                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          cv.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : cv.status === "INACTIVE"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                    >
                      {cv.status}
                    </span>
                  </td>

                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() => openDetail(cv.userId)}
                      className="bg-red-100 text-red-700 p-2 rounded-lg hover:bg-red-200"
                    >
                      <AiTwotoneEye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* PAGINATION */}
          <div className="flex justify-between px-6 py-4 bg-gray-50">
            <span>
              Trang {currentPage} / {totalPages}
            </span>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded
                    ${
                      currentPage === i + 1
                        ? "bg-red-600 text-white"
                        : "bg-white border"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== POPUP DETAIL ===== */}
      <CvDetailDialog
        open={showDetail}
        onClose={() => setShowDetail(false)}
        data={selectedCv}
      />
    </>
  );
};

export default ManageCv;
