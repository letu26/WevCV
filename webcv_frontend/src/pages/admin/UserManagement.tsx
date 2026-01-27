import { getUsers, UserPageResponse } from "@/services/adminservices/users";
import React, { useEffect, useState } from "react";

const UserManagement: React.FC = () => {

  const [users, setUser] = useState<UserPageResponse | null>(null);
  const [role, setRole] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = users ? users.totalPages : 1;


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers(currentPage - 1, 9, role, status); // page=0, size=9, không filter
        setUser(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, [status, role, currentPage]);

  console.log(users);
  console.log(role);
  return (
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
          <button
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
                <td className="px-6 py-4 font-medium">{user.id}</td>
                <td className="px-6 py-4 font-semibold text-gray-800">
                  {user.username}
                </td>
                <td className="px-6 py-4">{user.fullname}</td>
                <td className="px-6 py-4 text-gray-600">
                  {user.email}
                </td>

                {/* Roles */}
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {user.roles.map((role) => (
                      <span
                        key={role}
                        className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${user.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                      }`}
                  >
                    {user.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right space-x-2">
                  <button className="px-3 py-1.5 text-sm rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition">
                    Sửa
                  </button>
                  <button className="px-3 py-1.5 text-sm rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition">
                    Xóa
                  </button>
                </td>
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
  );
};

export default UserManagement;
