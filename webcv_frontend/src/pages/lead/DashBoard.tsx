import React from "react";

const DashBoard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-5">

      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Tổng quan hệ thống quản lý CV & User
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-500">Tổng CV</p>
          <p className="mt-2 text-3xl font-bold text-indigo-600">1,248</p>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-500">Project</p>
          <p className="mt-2 text-3xl font-bold text-green-600">312</p>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-500">Người dùng</p>
          <p className="mt-2 text-3xl font-bold text-orange-500">528</p>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-500">CV hôm nay</p>
          <p className="mt-2 text-3xl font-bold text-purple-600">36</p>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            CV mới cập nhật
          </h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="py-2 text-left">Ứng viên</th>
                <th className="text-left">Vị trí</th>
                <th className="text-left">Trạng thái</th>
                <th className="text-left">Ngày</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 font-medium">Nguyễn Văn A</td>
                <td>Frontend Dev</td>
                <td className="text-green-600 font-semibold">Approved</td>
                <td>Hôm nay</td>
              </tr>

              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 font-medium">Trần Thị B</td>
                <td>Backend Dev</td>
                <td className="text-yellow-500 font-semibold">Pending</td>
                <td>Hôm qua</td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="py-3 font-medium">Lê Văn C</td>
                <td>UI/UX</td>
                <td className="text-red-500 font-semibold">Rejected</td>
                <td>22/01</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Activity */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Hoạt động gần đây
          </h2>

          <ul className="space-y-3 text-sm">
            <li>
              <p className="font-medium">Admin duyệt CV</p>
              <p className="text-gray-500">Nguyễn Văn A – 5 phút trước</p>
            </li>

            <li>
              <p className="font-medium">User đăng ký mới</p>
              <p className="text-gray-500">email@gmail.com – 30 phút trước</p>
            </li>

            <li>
              <p className="font-medium">Project được tạo</p>
              <p className="text-gray-500">HR System – 2 giờ trước</p>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Thống kê CV theo trạng thái
          </h2>

          <div className="flex items-end gap-4 h-40">
            {[
              { label: "Mon", value: 24, color: "bg-green-500" },
              { label: "Tue", value: 18, color: "bg-green-500" },
              { label: "Wed", value: 30, color: "bg-green-500" },
              { label: "Thu", value: 14, color: "bg-yellow-400" },
              { label: "Fri", value: 22, color: "bg-yellow-400" },
              { label: "Sat", value: 10, color: "bg-red-500" },
              { label: "Sun", value: 6, color: "bg-red-500" },
            ].map((item, index) => (
              <div key={index} className="flex-1 text-center">
                <div
                  className={`w-full ${item.color} rounded-lg mb-2`}
                  style={{ height: `${item.value * 4}px` }}
                ></div>
                <p className="text-xs font-medium text-gray-600">{item.label}</p>
              </div>
            ))}
          </div>

        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Trạng thái hệ thống
          </h2>

          <ul className="space-y-3 text-sm">
            <li className="flex justify-between">
              <span>API Server</span>
              <span className="text-green-600 font-semibold">Online</span>
            </li>

            <li className="flex justify-between">
              <span>Database</span>
              <span className="text-green-600 font-semibold">Connected</span>
            </li>

            <li className="flex justify-between">
              <span>CV Processing</span>
              <span className="text-yellow-500 font-semibold">Busy</span>
            </li>

            <li className="flex justify-between">
              <span>Email Service</span>
              <span className="text-green-600 font-semibold">Running</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
