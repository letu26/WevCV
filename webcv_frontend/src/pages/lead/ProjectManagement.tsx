import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { AiTwotoneEye } from "react-icons/ai";
import {
  getLeadProjects,
  getLeadProjectDetail,
  ProjectResponse,
  ProjectDetailResponse,
  PageResponse,
} from "@/services/leadservice/lead.api";
import { removeMemberFromProject } from "@/services/leadservice/lead.api";

const ManageProject: React.FC = () => {
  const [projects, setProjects] =
    useState<PageResponse<ProjectResponse> | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] =
    useState<ProjectDetailResponse | null>(null);

  const [showDetail, setShowDetail] = useState(false);

  const totalPages = projects?.totalPages ?? 1;

  /* ================= FETCH ================= */
  const fetchProjects = async () => {
    try {
      const data = await getLeadProjects(currentPage - 1, 8);
      setProjects(data);
    } catch {
      toast.error("Không tải được danh sách project");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [currentPage]);

  /* ================= DETAIL ================= */
  const openDetail = async (id: number) => {
    try {
      const data = await getLeadProjectDetail(id);
      setSelectedProject(data);
      setShowDetail(true);
    } catch {
      toast.error("Không tải được chi tiết project");
    }
  };

  console.log(selectedProject);
  
  const handleRemoveMember = async (cvId: number) => {
    if (!selectedProject) return;

    try {
      await removeMemberFromProject(selectedProject.id, cvId);

      toast.success("Xoá thành viên thành công");

      // Cập nhật lại state (xoá khỏi UI ngay)
      setSelectedProject({
        ...selectedProject,
        members: selectedProject.members.filter((m) => m.id !== cvId),
      });
    } catch (error) {
      toast.error("Xoá thành viên thất bại");
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
          <h1 className="text-2xl font-semibold text-white">Quản lý Project</h1>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left">ID</th>
                <th className="px-6 py-4 text-left">Tên Project</th>
                <th className="px-6 py-4 text-left">Mô tả</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {projects?.content.map((project) => (
                <tr key={project.id} className="hover:bg-red-50">
                  <td className="px-6 py-3">{project.id}</td>

                  <td className="px-6 py-3 font-semibold">{project.name}</td>

                  <td className="px-6 py-3">{project.description}</td>

                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          project.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : project.status === "INACTIVE"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-200 text-gray-700"
                        }`}
                    >
                      {project.status}
                    </span>
                  </td>

                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() => openDetail(project.id)}
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
      {showDetail && selectedProject && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Chi tiết Project</h2>

            <div className="mb-4">
              <p className="font-semibold">{selectedProject.name}</p>
              <p className="text-sm text-gray-600">
                {selectedProject.description}
              </p>
              <p className="text-sm mt-2">
                Tạo bởi:{" "}
                <span className="font-semibold">
                  {selectedProject.create_by}
                </span>
              </p>
            </div>

            {/* MEMBERS */}
            <div>
              <h3 className="font-semibold mb-2">Thành viên</h3>

              <div className="space-y-2">
                {selectedProject.members.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 border rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">{m.fullname}</p>
                      <p className="text-xs text-gray-500">{m.email}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full
          ${
            m.role === "LEAD"
              ? "bg-red-100 text-red-700"
              : "bg-gray-200 text-gray-700"
          }`}
                      >
                        {m.role}
                      </span>

                      {m.role !== "LEAD" && (
                        <button
                          onClick={() => handleRemoveMember(m.id)}
                          className="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
                        >
                          Xoá
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() => setShowDetail(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageProject;
