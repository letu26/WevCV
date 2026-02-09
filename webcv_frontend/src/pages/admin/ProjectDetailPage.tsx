import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProjectDetail,
  updateProjectStatus,
  getLeads,
  updateProject,
  addProjectMember,
  ProjectDetailResponse,
  LeadResponse,
  ProjectStatus,
} from "@/services/adminservices/project.api";
import { toast } from "sonner";

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const projectId = Number(id);

  const [project, setProject] = useState<ProjectDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  /* APPLY LEAD */
  const [openModal, setOpenModal] = useState(false);
  const [leads, setLeads] = useState<LeadResponse[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);

  /* ================= FETCH ================= */
  const fetchProject = async () => {
    try {
      const res = await getProjectDetail(projectId);
      setProject(res);
      setName(res.name);
      setDescription(res.description);
    } catch {
      toast.error("Không tải được chi tiết project");
    }
  };

  useEffect(() => {
    if (projectId) fetchProject();
  }, [projectId]);

  /* ================= STATUS ================= */
  const handleChangeStatus = async (status: ProjectStatus) => {
    try {
      await updateProjectStatus(projectId, { status });
      toast.success("Cập nhật trạng thái thành công");
      fetchProject();
    } catch {
      toast.error("Cập nhật trạng thái thất bại");
    }
  };

  const handleUpdateProject = async () => {
    try {
      await updateProject(projectId, {
        name,
        description,
      });
      toast.success("Cập nhật project thành công");
      setEditing(false);
      fetchProject();
    } catch {
      toast.error("Cập nhật project thất bại");
    }
  };

  /* ================= APPLY LEAD ================= */
  const openApplyLeadModal = async () => {
    const res = await getLeads();
    setLeads(res);
    setOpenModal(true);
  };

  const handleApplyLead = async () => {
    if (!selectedLeadId) {
      toast.warning("Chọn 1 lead");
      return;
    }

    setLoading(true);
    try {
      await addProjectMember(projectId, {
        userId: selectedLeadId,
        role: "LEAD",
      });
      toast.success("Apply lead thành công");
      setOpenModal(false);
      setSelectedLeadId(null);
      fetchProject();
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER LEAD ================= */
  const availableLeads = useMemo(() => {
    if (!project) return [];
    const existedIds = project.members.map((m) => m.id);
    return leads.filter((l) => !existedIds.includes(l.id));
  }, [leads, project]);

  if (!project) return null;

  return (
    <div className="p-6">
      {/* ================= HEADER ================= */}
<div className="mb-8 rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 p-6 lg:p-8 text-white shadow-lg">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
    {/* Cột trái: Tên project + Description + Back button */}
    <div className="space-y-4">
      <button
        onClick={() => navigate("/admin/projects")}
        className="inline-flex items-center text-red-100 hover:text-white text-sm font-medium transition-colors"
      >
        ← Quay lại danh sách project
      </button>

      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {project.name}
        </h1>
        <p className="mt-2 text-red-100/90 leading-relaxed">
          {project.description || "Chưa có mô tả dự án"}
        </p>
      </div>
    </div>

    {/* Cột phải: Status + Edit button */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4 lg:justify-end">
      <div className="flex items-center gap-3">
        <label className="text-sm text-red-100 font-medium">Trạng thái:</label>
        <select
          value={project.status}
          onChange={(e) => handleChangeStatus(e.target.value as ProjectStatus)}
          className="px-4 py-2 bg-white/95 text-red-800 font-medium rounded-lg border border-red-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition"
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
      </div>

      <button
        onClick={() => setEditing(true)}
        className="px-5 py-2.5 bg-white text-red-700 font-semibold rounded-lg shadow hover:bg-red-50 transition-colors"
      >
        Chỉnh sửa
      </button>
    </div>
  </div>
</div>

{editing && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
      {/* Header modal */}
      <div className="bg-red-600 px-6 py-4 text-white">
        <h3 className="text-xl font-semibold">Chỉnh sửa thông tin project</h3>
      </div>

      {/* Body */}
      <div className="p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên project
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
            placeholder="Nhập tên project..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition resize-none"
            placeholder="Mô tả chi tiết về project..."
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
        <button
          onClick={() => {
            setEditing(false);
            setName(project.name);
            setDescription(project.description || "");
          }}
          className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
        >
          Hủy
        </button>
        <button
          onClick={handleUpdateProject}
          className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition shadow-sm"
        >
          Lưu thay đổi
        </button>
      </div>
    </div>
  </div>
)}

      {/* INFO */}
      <div className="bg-white rounded-xl shadow p-6 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-500">Project ID</p>
          <p className="font-semibold">{project.id}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Created by</p>
          <p className="font-semibold">{project.create_by}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold
              ${
                project.status === "ACTIVE"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
          >
            {project.status}
          </span>
        </div>
      </div>

      {/* MEMBERS */}
      <div className="bg-white rounded-xl shadow">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-lg font-semibold">Project Members</h2>
          <button
            onClick={openApplyLeadModal}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            + Apply Lead
          </button>
        </div>

        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left">ID</th>
              <th className="px-6 py-4 text-left">Fullname</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {project.members.map((m) => (
              <tr key={m.id} className="hover:bg-red-50">
                <td className="px-6 py-3">{m.id}</td>
                <td className="px-6 py-3 font-medium">{m.fullname}</td>
                <td className="px-6 py-3">{m.email}</td>
                <td
                  className={`px-6 py-3 font-semibold ${
                    m.role === "LEAD" ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {m.role}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* APPLY LEAD MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Apply Lead</h3>

            <select
              className="w-full border rounded-lg px-3 py-2"
              value={selectedLeadId ?? ""}
              onChange={(e) => setSelectedLeadId(Number(e.target.value))}
            >
              <option value="">-- Chọn lead --</option>
              {availableLeads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.fullname} - {l.email}
                </option>
              ))}
            </select>

            {availableLeads.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Không còn lead nào để gán
              </p>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Hủy
              </button>
              <button
                disabled={loading}
                onClick={handleApplyLead}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailPage;
