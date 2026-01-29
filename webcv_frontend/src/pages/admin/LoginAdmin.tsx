import { login } from "@/services/adminservices/login";
import React from "react";
import { useNavigate } from "react-router";
import { toast, Toaster } from "sonner";

const LoginAdmin: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const username = (e.target as any)[0].value;
    const password = (e.target as any)[1].value;

    try {
      const res = await login({ username, password });

      const roles = res.role;

      if (!roles.includes("ADMIN") && !roles.includes("LEAD")) {
        toast.error("Bạn không có quyền truy cập hệ thống này");
        return;
      }
      //lưu token và role vào localStorage
      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);
      localStorage.setItem("userId", res.userId.toString());
      localStorage.setItem("fullname", res.fullName);
      localStorage.setItem("email",  res.email);
      localStorage.setItem("roles", JSON.stringify(roles));

      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1000);
      toast.success("Đăng nhập thành công");
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("Sai username hoặc password");
      } else {
        toast.error("Đăng nhập thất bại");
      }
    }
  };


  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center px-4">
      <Toaster richColors position="bottom-right" />
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Admin Login
          </h2>
          <p className="text-gray-500 mt-2">
            Đăng nhập hệ thống quản trị
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Nhập username"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Remember & Forgot */}
          <div className="flex justify-end items-center text-sm">
            <a
              href="#"
              className="text-indigo-600 hover:underline text-right"
            >
              Quên mật khẩu?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md"
          >
            Đăng nhập
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          © 2026 Admin System
        </p>
      </div>
    </div>
  );
};

export default LoginAdmin;
