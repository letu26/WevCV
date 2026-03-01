import {
  createProject,
  getProjects,
  getProjectDetail,
  updateProjectStatus,
  Project,
  ProjectPageResponse,
  ProjectStatus,
  getLeads,
  addProjectMember,
} from "@/services/adminservices/project.api";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { AiTwotoneEdit } from "react-icons/ai";
import { useSearch } from "@/hooks/useSearch";
import useDebounce from "@/hooks/useDebounce";
import { useNavigate } from "react-router-dom";

const ProjectManagement: React.FC = () => {
  const { search } = useSearch();
  const debouncedSearch = useDebounce(search, 500);

  const [projects, setProjects] = useState<ProjectPageResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState<ProjectStatus | undefined>();
  console.log(projects);
  const navigate = useNavigate();

  const [leads, setLeads] = useState<any[]>([]);
  const [showLeadPicker, setShowLeadPicker] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus>("ACTIVE");

  const [showCreate, setShowCreate] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const totalPages = projects?.totalPages ?? 1;

  /* ================= FETCH ================= */
  const fetchProjects = async () => {
    try {
      const data = await getProjects(
        currentPage - 1,
        8,
        status,
        debouncedSearch,
      );
      setProjects(data);
    } catch {
      toast.error("Không tải được danh sách project");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [currentPage, status, debouncedSearch]);

  /* ================= CREATE ================= */
  const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    try {
      await createProject({
        name: (form.name as unknown as HTMLInputElement).value,
        description: (form.description as HTMLTextAreaElement).value,
      });

      toast.success("Tạo project thành công");
      setShowCreate(false);
      fetchProjects();
    } catch {
      toast.error("Tạo project thất bại");
    }
  };

  /* ================= DETAIL ================= */
  const openDetail = (id: number) => {
    navigate(`/admin/projects/${id}`);
  };

  /* ================= STATUS ================= */
  const toggleStatus = async (project: Project) => {
    try {
      await updateProjectStatus(project.id, {
        status: project.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
      });
      fetchProjects();
    } catch {
      toast.error("Cập nhật trạng thái thất bại");
    }
  };

  return (
    <>
      <div className="p-6">
        {/* HEADER */}
        <div
          className="mb-6 rounded-xl bg-linear-to-r from-red-600 to-red-700 p-6
          flex flex-col gap-4 md:flex-row md:justify-between md:items-center"
        >
          <h1 className="text-2xl font-semibold text-white">Quản lý Project</h1>

          <div className="flex gap-3 flex-wrap">
            <select
              value={status ?? ""}
              onChange={(e) =>
                setStatus(
                  e.target.value
                    ? (e.target.value as ProjectStatus)
                    : undefined,
                )
              }
              className="px-4 py-2 rounded-lg"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>

            <button
              onClick={() => setShowCreate(true)}
              className="px-4 py-2 bg-white text-red-600 rounded-lg font-medium
                hover:bg-red-100"
            >
              + Tạo project
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left">ID</th>
                <th className="px-6 py-4 text-left">Tên</th>
                <th className="px-6 py-4 text-left">Mô tả</th>
                <th className="px-6 py-4 text-left">Trạng thái</th>
                <th className="px-6 py-4 text-left">Tạo bởi</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {projects?.content.map((p) => (
                <tr key={p.id} className="hover:bg-red-50">
                  <td className="px-6 py-3">{p.id}</td>
                  <td className="px-6 py-3 font-semibold">{p.name}</td>
                  <td className="px-6 py-3 max-w-xs truncate">
                    {p.description}
                  </td>

                  <td className="px-6 py-3">
                    <span
                      onClick={() => toggleStatus(p)}
                      className={`cursor-pointer px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          p.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                    >
                      {p.status}
                    </span>
                  </td>

                  <td className="px-6 py-3">{p.create_by}</td>

                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() => openDetail(p.id)}
                      className="bg-red-100 text-red-700 p-2 rounded-lg hover:bg-red-200"
                    >
                      <AiTwotoneEdit size={18} />
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

      {/* ===== POPUP CREATE ===== */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form
            onSubmit={handleCreateProject}
            className="bg-white w-full max-w-lg rounded-xl p-6"
          >
            <h2 className="text-lg font-semibold mb-4">Tạo Project</h2>

            <input
              name="name"
              placeholder="Tên project"
              className="w-full border rounded-lg px-3 py-2 mb-3"
            />

            <textarea
              name="description"
              placeholder="Mô tả"
              className="w-full border rounded-lg px-3 py-2 mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Hủy
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg">
                Tạo
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ===== POPUP DETAIL ===== */}
      {showDetail && selectedProject && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-xl rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">
              {selectedProject.name}
            </h2>

            <p className="mb-3">{selectedProject.description}</p>

            <h3 className="font-semibold mb-2">Members</h3>
            <ul className="space-y-2">
              {selectedProject.members.map((m: any) => (
                <li key={m.id} className="flex justify-between text-sm">
                  <span>
                    {m.fullname} ({m.email})
                  </span>
                  <span className="font-semibold text-red-600">{m.role}</span>
                </li>
              ))}
            </ul>

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

export default ProjectManagement;
