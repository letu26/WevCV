import { createUser, CreateUserRequest, editRoles, editStatus, getUsers, Role, UpdateRole, UpdateStatus, UserPageResponse, UserStatus } from "@/services/adminservices/users";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { AiTwotoneEdit } from "react-icons/ai";
import axios from "axios";
import { useSearch } from "@/hooks/useSearch";
import useDebounce from "@/hooks/useDebounce";


const UserManagement: React.FC = () => {
  const { search } = useSearch();
  const debouncedSearch = useDebounce(search, 500);

  const [users, setUser] = useState<UserPageResponse | null>(null);
  const [idEdit, setIdEdit] = useState<number>(null);
  const [checkForm, setCheckForm] = useState<boolean>(false);
  const [role, setRole] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [editingRoles, setEditingRoles] = useState<number | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [editingStatus, setEditingStatus] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");

  const totalPages = users ? users.totalPages : 1;

  const fetchUsers = async () => {
    try {
      const data = await getUsers(currentPage - 1, 8, role, status, debouncedSearch || undefined); // page=0, size=9, không filter
      setUser(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
    setCurrentPage(1);
  }, [status, role, currentPage, debouncedSearch]);

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const data: CreateUserRequest = {
      username: (form.elements.namedItem("username") as HTMLInputElement).value,
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      fullname: (form.elements.namedItem("fullname") as HTMLInputElement).value,

      roles: Array.from(
        form.querySelectorAll('input[name="roles"]:checked')
      ).map(input => (input as HTMLInputElement).value as Role),

      status: (form.elements.namedItem("status") as HTMLSelectElement)
        .value as UserStatus
    };

    try {
      const response = await createUser(data);

      if (response.code === "201") {
        toast.success(response.message);
        await fetchUsers();
        setTimeout(() => {
          setCheckForm(false);
        }, 1500);
      } else {
        toast.error(response.message || "Thao tác thất bại");
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          "Có lỗi xảy ra, vui lòng thử lại";
        toast.error(message);
      } else {
        toast.error("Lỗi không xác định");
      }
    }
  }

  const handleEditRoles = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id = idEdit;
    const roles = selectedRoles as Role[];
    const data: UpdateRole = {
      roles,
    }
    try {
      const response = await editRoles(data, id);
      toast.success(response.message);
      setUser(prev => {
        if (!prev) return prev;

        return {
          ...prev,
          content: prev.content.map(u =>
            u.id === id
              ? { ...u, roles: data.roles }
              : u
          )
        };
      });

      setEditingRoles(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          "Có lỗi xảy ra, vui lòng thử lại";
        toast.error(message);
      } else {
        toast.error("Lỗi không xác định");
      }
    }
  };

  const handleEditStatus = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id = idEdit;
    const data: UpdateStatus = {
      status: selectedStatus
    }

    try {
      const response = await editStatus(data, id);
      toast.success(response.message);

      setUser(prev => {
        if (!prev) return prev;

        const updatedContent = prev.content.map(u =>
          u.id === id
            ? { ...u, status: data.status as "ACTIVE" | "INACTIVE" }
            : u
        );

        return { ...prev, content: updatedContent };
      });

      setEditingStatus(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          "Có lỗi xảy ra, vui lòng thử lại";
        toast.error(message);
      } else {
        toast.error("Lỗi không xác định");
      }
    }
  }

  return (
    <>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 p-6 flex flex-col gap-4 shadow
                md:flex-row md:items-center md:justify-between">

          {/* Title */}
          <h1 className="text-2xl font-semibold text-white">
            Quản lý người dùng
          </h1>

          {/* Filters + Action */}
          <div className="flex flex-wrap items-center gap-3">

            {/* Filter Status */}
            <select
              value={status ?? ""}
              onChange={(e) =>
                setStatus(e.target.value || undefined)
              }
              className="px-4 py-2 rounded-lg bg-white/90 text-gray-700
                 focus:outline-none focus:ring-2 focus:ring-white
                 cursor-pointer"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>

            {/* Filter Role */}
            <select
              value={role ?? ""}
              onChange={(e) =>
                setRole(e.target.value || undefined)
              }
              className="px-4 py-2 rounded-lg bg-white/90 text-gray-700
                 focus:outline-none focus:ring-2 focus:ring-white
                 cursor-pointer"
            >
              <option value="">Tất cả vai trò</option>
              <option value="ADMIN">ADMIN</option>
              <option value="LEAD">LEAD</option>
              <option value="USER">USER</option>
            </select>

            {/* Add Button */}
            <button onClick={() => (setCheckForm(true))}
              className="px-4 py-2 bg-white text-indigo-600 font-medium rounded-lg
                 transition border-2 border-transparent
                 hover:bg-purple-600 hover:text-white hover:border-white"
            >
              + Thêm người dùng
            </button>
          </div>
        </div>


        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 text-left">STT</th>
                <th className="px-6 py-4 text-left">ID</th>
                <th className="px-6 py-4 text-left">Username</th>
                <th className="px-6 py-4 text-left">Họ tên</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Roles</th>
                <th className="px-6 py-4 text-left">Trạng thái</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {users?.content.map((user, index) => (
                <tr
                  key={index}
                  className={`transition ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-indigo-50`}
                >
                  <td className="px-6 py-4 font-medium">{index + 1}</td>
                  <td className="px-6 py-4 font-medium">{user.id}</td>
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {user.username}
                  </td>
                  <td className="px-6 py-4">{user.fullname}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {user.email}
                  </td>

                  {/* Roles */}
                  <td className="px-6 py-4 w-50">
                    <div className="flex items-center gap-4">
                      {/* ROLE */}
                      <div className="flex flex-wrap gap-2" style={{ width: "120px" }}>
                        {user?.roles.map((role) => (
                          <span
                            key={role}
                            className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700 whitespace-nowrap"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                      {editingRoles === user.id && (
                        <div
                          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                          onClick={() => setEditingRoles(null)} // click ngoài => đóng
                        >
                          <form onSubmit={handleEditRoles}>
                            <div
                              onClick={(e) => e.stopPropagation()} // click trong => KHÔNG đóng
                              className="w-70 rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-lg"
                            >
                              <p className="mb-2 text-sm font-semibold text-gray-700">
                                Chỉnh sửa quyền
                              </p>

                              <div className="flex flex-col gap-2">
                                {["ADMIN", "LEAD", "USER"].map((role) => (
                                  <label
                                    key={role}
                                    className="flex items-center gap-2 text-sm cursor-pointer"
                                  >
                                    <input
                                      type="checkbox"
                                      name="roles-edit"
                                      checked={selectedRoles.includes(role)}
                                      onChange={(e) => {
                                        setSelectedRoles((prev) =>
                                          e.target.checked
                                            ? [...prev, role]
                                            : prev.filter((r) => r !== role)
                                        );
                                      }}
                                      className="accent-indigo-600"
                                    />
                                    <span>{role}</span>
                                  </label>
                                ))}
                              </div>

                              {/* Actions */}
                              <div className="mt-4 flex justify-end gap-2">
                                <button
                                  onClick={() => setEditingRoles(null)}
                                  className="px-3 py-1.5 text-sm rounded-md bg-gray-200 hover:bg-gray-300"
                                >
                                  Hủy
                                </button>

                                <button
                                  type="submit"
                                  onClick={() => (setIdEdit(user.id))}
                                  className="px-3 py-1.5 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                                >
                                  Lưu
                                </button>
                              </div>
                            </div>
                          </form>

                        </div>
                      )}

                      {/* ACTION */}
                      {user?.roles.includes("ADMIN") ? (
                        <>
                          <button
                            disabled
                            className="cursor-not-allowed opacity-40 shrink-0 bg-yellow-100 text-yellow-700 p-2.5 rounded-lg hover:bg-yellow-200 active:scale-90 transition-all duration-200"
                            title="Chỉnh sửa"
                          >
                            <AiTwotoneEdit size={22} />
                          </button>
                        </>) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingRoles(user.id);
                              setSelectedRoles(user.roles);
                            }}
                            className="shrink-0 bg-yellow-100 text-yellow-700 p-2.5 rounded-lg hover:bg-yellow-200 active:scale-90 transition-all duration-200"
                            title="Chỉnh sửa"
                          >
                            <AiTwotoneEdit size={22} />
                          </button>
                        </>)}
                    </div>
                  </td>
                  {/* Status */}
                  <td className="px-6 py-4 w-50">
                    <div className="flex items-center gap-4">
                      {/* STATUS */}
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${user.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                          }`}
                        style={{ width: "75px" }}
                      >
                        {user.status}
                      </span>
                      {editingStatus === user.id && (
                        <div
                          className="fixed inset-0 z-50 flex items-center justify-center"
                          onClick={() => setEditingStatus(null)} // click nền -> đóng
                        >
                          {/* nền đen mờ */}
                          <div className="absolute inset-0 bg-black/40" />

                          {/* FORM */}
                          <div
                            className="relative bg-white w-[320px] rounded-xl shadow-2xl p-6 animate-in fade-in zoom-in-95"
                            onClick={(e) => e.stopPropagation()} // tránh click lan ra ngoài
                          >
                            <form onSubmit={handleEditStatus}>
                              <h2 className="text-lg font-semibold mb-4">
                                Chỉnh sửa trạng thái
                              </h2>

                              <div className="flex flex-col gap-3 mb-6">
                                <label className="flex items-center gap-3 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="status"
                                    value="ACTIVE"
                                    checked={selectedStatus === "ACTIVE"}
                                    onChange={(e) => setSelectedStatus(e.target.value as "ACTIVE")}
                                  />

                                  <span className="text-green-700 font-medium">ACTIVE</span>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="status"
                                    value="INACTIVE"
                                    checked={selectedStatus === "INACTIVE"}
                                    onChange={(e) => setSelectedStatus(e.target.value as "INACTIVE")}
                                  />
                                  <span className="text-red-700 font-medium">INACTIVE</span>
                                </label>
                              </div>
                              {/* BUTTONS */}
                              <div className="flex justify-end gap-3">
                                <button
                                  onClick={() => setEditingStatus(null)}
                                  className="px-4 py-2 rounded-lg border hover:bg-gray-100 transition"
                                >
                                  Hủy
                                </button>

                                <button
                                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition"
                                >
                                  Lưu
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      )}

                      {/* EDIT */}
                      {user?.roles.includes("ADMIN") ? (
                        <>
                          <button
                            disabled
                            className="cursor-not-allowed opacity-40 shrink-0 bg-yellow-100 text-yellow-700 p-2.5 rounded-lg hover:bg-yellow-200 active:scale-90 transition-all duration-200"
                            title="Chỉnh sửa"
                          >
                            <AiTwotoneEdit size={22} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingStatus(user.id)
                              setSelectedStatus(user.status);
                              setIdEdit(user.id);
                            }}

                            className="shrink-0 bg-yellow-100 text-yellow-700 p-2.5 rounded-lg hover:bg-yellow-200 active:scale-90 transition-all duration-200"
                            title="Chỉnh sửa"
                          >
                            <AiTwotoneEdit size={22} />
                          </button>
                        </>
                      )}

                    </div>
                  </td>


                  {/* Actions */}
                  {user?.roles.includes("ADMIN") ? (<>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button disabled className="cursor-not-allowed opacity-40 px-3 py-1.5 text-sm rounded-md bg-red-100 text-red-700">
                        Xóa
                      </button>
                    </td>
                  </>) : (
                    <td className="px-6 py-4 text-right space-x-2">
                      <button className="px-3 py-1.5 text-sm rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition">
                        Xóa
                      </button>
                    </td>)}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50">
            <span className="text-sm text-gray-600">
              Trang {currentPage} / {totalPages}
            </span>

            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1 text-sm rounded-md bg-white border hover:bg-gray-100 disabled:opacity-50"
              >
                Trước
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 text-sm rounded-md ${currentPage === i + 1
                    ? "bg-indigo-600 text-white"
                    : "bg-white border hover:bg-gray-100"
                    }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 text-sm rounded-md bg-white border hover:bg-gray-100 disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
      {checkForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative">

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Tạo mới người dùng
              </h2>
              <button
                onClick={() => setCheckForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleCreateUser}>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Nhập username"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Nhập mật khẩu"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="email@gmail.com"
                />
              </div>

              {/* Full name */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Họ và tên
                </label>
                <input
                  type="text"
                  name="fullname"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Nguyễn Văn A"
                />
              </div>

              {/* Role - multiple select */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Role
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {["ADMIN", "LEAD", "USER"].map((role) => (
                    <label
                      key={role}
                      className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                    >
                      <input
                        name="roles"
                        type="checkbox"
                        value={role}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      {role}
                    </label>
                  ))}
                </div>
              </div>


              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setCheckForm(false)}
                  className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-100"
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Tạo người dùng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserManagement;
