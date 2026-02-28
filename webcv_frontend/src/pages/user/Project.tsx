import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { AiOutlineProject, AiOutlineTeam, AiOutlineUser } from "react-icons/ai";
import { 
  getMyProjectDetail, 
  ProjectDetailResponse 
} from "@/services/usersservices/ProjectService";

const MyProjectPage: React.FC = () => {
  const [project, setProject] = useState<ProjectDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyProject = async () => {
      try {
        setLoading(true);
        const data = await getMyProjectDetail();
        setProject(data);
      } catch (error) {
        toast.error("Bạn chưa tham gia vào dự án nào hoặc không tải được dữ liệu.");
      } finally {
        setLoading(false);
      }
    };
    fetchMyProject();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen italic text-gray-500">
        Đang tải thông tin dự án...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-10 text-center">
        <div className="bg-orange-50 border border-orange-200 p-6 rounded-xl inline-block">
          <p className="text-orange-700 font-medium">Bạn hiện chưa được phân công vào dự án nào.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* HEADER: Tên dự án và Trạng thái */}
      <div className="mb-8 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 p-8 text-white shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AiOutlineProject size={24} className="text-blue-200" />
              <span className="text-blue-100 uppercase tracking-widest text-xs font-bold">Dự án của tôi</span>
            </div>
            <h1 className="text-3xl font-extrabold">{project.name}</h1>
          </div>
          <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase shadow-sm ${
            project.status === "ACTIVE" ? "bg-green-400 text-green-900" : "bg-yellow-400 text-yellow-900"
          }`}>
            {project.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CỘT TRÁI: THÔNG TIN CHUNG */}
        <div className="md:col-span-2 space-y-6">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Mô tả dự án</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {project.description || "Dự án này chưa có mô tả chi tiết."}
            </p>
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4 border-b pb-2">
              <AiOutlineTeam size={20} className="text-indigo-600" />
              <h2 className="text-lg font-bold text-gray-800">Thành viên nhóm ({project.members.length})</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.members.map((m) => (
                <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-transparent hover:border-indigo-100 transition-all">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                    {m.fullname.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{m.fullname}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-500">{m.email}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                        m.role === 'LEAD' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {m.role}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* CỘT PHẢI: CHI TIẾT PHỤ */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Thông tin quản lý</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                  <AiOutlineUser size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Người tạo / Quản lý</p>
                  <p className="font-bold text-gray-800">{project.create_by}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
            <h3 className="text-indigo-800 font-bold mb-2">Ghi chú cho bạn</h3>
            <p className="text-sm text-indigo-600 leading-snug">
              Đây là thông tin dự án bạn đang tham gia. Nếu có sai sót về thành viên hoặc mô tả, vui lòng liên hệ với Lead của bạn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProjectPage;