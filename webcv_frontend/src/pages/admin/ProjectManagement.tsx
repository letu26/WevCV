import React, { useEffect, useState } from "react";
import {
  getProjects,
  createProject,
  updateProjectStatus,
  deleteProject,
  Project,
  ProjectPageResponse,
  ProjectStatus,
} from "@/services/adminservices/projects";
import { toast } from "sonner";
import { AiTwotoneEdit } from "react-icons/ai";
import { useSearch } from "@/hooks/useSearch";
import useDebounce from "@/hooks/useDebounce";

const ProjectManagement: React.FC = () => {
  const { search } = useSearch();
  const debouncedSearch = useDebounce(search, 500);

  const [projects, setProjects] = useState<ProjectPageResponse | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>();
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);

  const fetchProjects = async () => {
    try {
      const data = await getProjects(
        currentPage - 1,
        8,
        statusFilter,
        debouncedSearch
      );
      setProjects(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [currentPage, statusFilter, debouncedSearch]);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      description: (form.elements.namedItem("description") as HTMLInputElement)
        .value,
      status: (form.elements.namedItem("status") as HTMLSelectElement)
        .value as ProjectStatus,
    };

    try {
      const res = await createProject(data);
      toast.success(res.message);
      setShowForm(false);
      fetchProjects();
    } catch {
      toast.error("Tạo project thất bại");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex justify-between items-center shadow">
        <h1 className="text-2xl font-semibold text-white">
          Quản lý Project
        </h1>

        <div className="flex gap-3">
          <select
            onChange={(e) =>
              setStatusFilter(e.target.value || undefined)
            }
            className="px-4 py-2 rounded-lg bg-white"
          >
            <option value="">Tất cả</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="DONE">DONE</option>
          </select>

          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-white text-indigo-600 rounded-lg"
          >
            + Thêm Project
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 text-left">ID</th>
              <th className="px-6 py-4 text-left">Tên</th>
              <th className="px-6 py-4 text-left">Mô tả</th>
              <th className="px-6 py-4 text-left">Trạng thái</th>
              <th className="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {projects?.content.map((p: Project) => (
              <tr key={p.id} className="border-b hover:bg-indigo-50">
                <td className="px-6 py-4">{p.id}</td>
                <td className="px-6 py-4 font-semibold">{p.name}</td>
                <td className="px-6 py-4">{p.description}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      p.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : p.status === "DONE"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() =>
                      updateProjectStatus(
                        p.id,
                        p.status === "ACTIVE" ? "DONE" : "ACTIVE"
                      ).then(fetchProjects)
                    }
                    className="px-3 py-1 text-sm bg-yellow-100 rounded-md"
                  >
                    Đổi trạng thái
                  </button>

                  <button
                    onClick={() =>
                      deleteProject(p.id).then(fetchProjects)
                    }
                    className="px-3 py-1 text-sm bg-red-100 rounded-md"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <form
            onSubmit={handleCreate}
            className="bg-white p-6 rounded-xl w-96 space-y-4"
          >
            <h2 className="text-lg font-semibold">
              Tạo Project
            </h2>

            <input
              name="name"
              placeholder="Tên project"
              className="w-full border px-3 py-2 rounded"
            />

            <textarea
              name="description"
              placeholder="Mô tả"
              className="w-full border px-3 py-2 rounded"
            />

            <select
              name="status"
              className="w-full border px-3 py-2 rounded"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border rounded"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded"
              >
                Tạo
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;