import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";

import {
  getDashboard,
  getRecentActivities,
  getSystemStatus,
  RangeType,
} from "@/services/adminservices/dashboard";

import { DashboardResponse } from "@/types/admin/dashboard";

// 1. Helpers: Đưa ra ngoài để tránh lỗi "before initialization" và tối ưu render
const formatActivityType = (type: string) => {
  const types: Record<string, string> = {
    CV_CREATED: "Một CV mới được tạo",
    CV_APPROVED: "Một quản trị viên đã duyệt CV",
    USER_REGISTER: "Người dùng đăng ký mới",
    PROJECT_CREATED: "Dự án mới được triển khai",
  };
  return types[type] || "Hoạt động";
};

const formatTimeAgo = (minutes: number) => {
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
};
export type DiffType = "USER" | "PROJECT" | "CV";

const DashBoard: React.FC = () => {
  const [range, setRange] = useState<RangeType>("DAY");
  const [differentChart, setDifferentChart] = useState<DiffType>("CV");
  const chartTitle =
    differentChart === "CV"
      ? "Biểu đồ CV nhận được"
      : differentChart === "USER"
      ? "Biểu đồ người dùng"
      : "Biểu đồ dự án";

  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

  // 2. Quản lý Data tập trung bằng useQuery
  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["dashboard-full-data", range],
    queryFn: async () => {
      const [dashboardRes, activityRes, systemRes] = await Promise.all([
        getDashboard(range),
        getRecentActivities(5),
        getSystemStatus(),
      ]);

      return {
        dashboard: dashboardRes.data,
        activities: activityRes.data,
        systemStatus: systemRes.data,
      };
    },
    retry: 3, // Khớp với logic backend (attempt < 4)
    retryDelay: 1000,
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // 3. Xử lý các trạng thái đặc biệt (Loading / Error)
  if (isLoading) return <div className="p-8 flex justify-center items-center h-screen animate-pulse text-indigo-600 font-bold">Đang tải dữ liệu hệ thống...</div>;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 bg-gray-50 dark:bg-gray-900">
        <div className="text-red-500 text-6xl">⚠️</div>
        <h2 className="text-xl font-bold dark:text-white">Mất kết nối với máy chủ</h2>
        <p className="text-gray-500 dark:text-gray-400 text-center">Hệ thống đang gặp sự cố tạm thời hoặc Database không phản hồi.</p>
        <button
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-all shadow-lg"
          onClick={() => refetch()}
        >
          Thử kết nối lại ngay
        </button>
      </div>
    );
  }

  // 4. Data an toàn sau khi qua bước check Loading/Error
  const { dashboard, activities, systemStatus } = data!;

  const summary = dashboard?.summary;

  const chartData =
            differentChart === "CV"
              ? dashboard.cvChart
              : differentChart === "USER"
              ? dashboard.userChart
              : dashboard.projectChart;

  return (
    <div className="min-h-screen p-8 space-y-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 transition-colors duration-500">

      {/* Thông báo Retry nổi lên khi gặp lỗi timeout (Backend attempt 2, 3) */}
      {isFetching && !isLoading && (
        <div className="fixed top-4 right-4 z-50 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-2xl animate-bounce flex items-center gap-2">
          <span className="animate-spin text-xl">⏳</span> Đang thử kết nối lại...
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Chào mừng bạn trở lại hệ thống quản trị.</p>
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-3 rounded-2xl bg-white dark:bg-gray-800 shadow-md hover:scale-110 transition-transform border border-gray-200 dark:border-gray-700"
        >
          {darkMode ? "🌞" : "🌙"}
        </button>
      </div>

      {/* RANGE TOGGLE */}
      <div className="inline-flex bg-gray-200 dark:bg-gray-800 rounded-2xl p-1.5 shadow-inner">
        {(["DAY", "WEEK", "MONTH", "YEAR"] as RangeType[]).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-6 py-2 text-sm font-semibold rounded-xl transition-all ${
              range === r
                ? "bg-white dark:bg-gray-700 text-indigo-600 shadow-md"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* TOGGLE */}
        <div className="inline-flex bg-gray-200 dark:bg-gray-800 rounded-2xl p-1.5 shadow-inner">
          {(["USER", "PROJECT", "CV"] as DiffType[]).map((b) => (
            <button
              key={b}
              onClick={() => setDifferentChart(b)}
              className={`px-6 py-2 text-sm font-semibold rounded-xl transition-all ${
                differentChart === b
                  ? "bg-white dark:bg-gray-700 text-indigo-600 shadow-md"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {b}
            </button>
          ))}
        </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Tổng CV" value={summary?.totalCvs ?? 0} growth={summary?.cvsGrowthPercent} />
        <StatCard title="Project" value={summary?.totalProjects ?? 0} growth={summary?.projectsGrowth} />
        <StatCard title="Người dùng" value={summary?.totalUsers ?? 0} growth={summary?.usersGrowth} />
        <StatCard title="CV hôm nay" value={summary?.newCvsToday ?? 0} />
      </div>

      {/* CHART + ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CHART */}
        <div className="lg:col-span-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white dark:border-gray-700 h-[420px]">
          <h2 className="font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-indigo-500 rounded-full"></span> {chartTitle}
          </h2>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDash array="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip
                contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", background: darkMode ? '#1f2937' : '#fff' }}
              />
              <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={4} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ACTIVITY */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white dark:border-gray-700 h-[420px] overflow-y-auto custom-scrollbar">
          <h2 className="font-bold text-gray-800 dark:text-white mb-6">Hoạt động gần đây</h2>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all border border-transparent hover:border-indigo-200">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  {formatActivityType(activity.type)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {activity.title} • <span className="italic text-indigo-400">{formatTimeAgo(activity.minutesAgo)}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SYSTEM STATUS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatusCard title="Server API" status={systemStatus.api} />
        <StatusCard title="Hệ quản trị Database" status={systemStatus.database} />
      </div>
    </div>
  );
};

// Sub-components giữ nguyên logic nhưng tối ưu UI một chút
const StatCard = ({ title, value, growth }: any) => {
  const isUp = growth && growth >= 0;
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white dark:border-gray-700 hover:-translate-y-1 transition-transform">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      <p className="mt-2 text-4xl font-black text-indigo-600 dark:text-indigo-400">{value.toLocaleString()}</p>
      {growth !== undefined && (
        <div className={`inline-flex items-center px-2 py-1 rounded-lg mt-3 text-xs font-bold ${isUp ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
          {isUp ? "▲" : "▼"} {Math.abs(growth)}%
        </div>
      )}
    </div>
  );
};

const StatusCard = ({ title, status }: any) => {
  const isOnline = status === "ONLINE" || status === "CONNECTED";
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-5 shadow-lg border border-white dark:border-gray-700 flex justify-between items-center">
      <span className="font-semibold text-gray-700 dark:text-gray-300">{title}</span>
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500 animate-pulse" : "bg-red-500"}`}></span>
        <span className={`text-sm font-bold ${isOnline ? "text-green-600" : "text-red-600"}`}>{status}</span>
      </div>
    </div>
  );
};

export default DashBoard;