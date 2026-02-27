import React, { useEffect, useState } from "react";
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

const DashBoard: React.FC = () => {
  const navigate = useNavigate();

  const [activities, setActivities] = useState<any[]>([]);
  const [range, setRange] = useState<RangeType>("DAY");
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] =
    useState<DashboardResponse | null>(null);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const summary = dashboard?.summary;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    fetchAll();
  }, [range]);

  const fetchAll = async () => {
    try {
      setLoading(true);

      const [dashboardRes, activityRes, systemRes] =
        await Promise.all([
          getDashboard(range),
          getRecentActivities(5),
          getSystemStatus(),
        ]);

      setDashboard(dashboardRes.data);
      setActivities(activityRes.data);
      setSystemStatus(systemRes.data);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatActivityType = (type: string) => {
    switch (type) {
      case "CV_CREATED":
        return "CV mới được tạo";
      case "CV_APPROVED":
        return "Admin duyệt CV";
      case "USER_REGISTERED":
        return "User đăng ký mới";
      case "PROJECT_CREATED":
        return "Project được tạo";
      default:
        return "Hoạt động";
    }
  };

  const formatTimeAgo = (minutes: number) => {
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    return `${days} ngày trước`;
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!dashboard) return null;

  return (
    <div className="min-h-screen p-8 space-y-8
      bg-gradient-to-br from-gray-50 to-gray-100
      dark:from-gray-900 dark:to-gray-950 transition">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 rounded-full bg-indigo-600 text-white text-sm"
        >
          {darkMode ? "🌞 Light" : "🌙 Dark"}
        </button>
      </div>

      {/* RANGE TOGGLE */}
      <div className="inline-flex bg-gray-200 dark:bg-gray-800 rounded-full p-1">
        {["DAY", "WEEK", "MONTH"].map((r) => (
          <button
            key={r}
            onClick={() => setRange(r as RangeType)}
            className={`px-4 py-1 text-sm rounded-full transition ${
              range === r
                ? "bg-white dark:bg-gray-700 shadow"
                : "text-gray-500"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard
          title="Tổng CV"
          value={summary?.totalCvs ?? 0}
          growth={summary?.cvsGrowthPercent}
        />
        <StatCard
          title="Project"
          value={summary?.totalProjects ?? 0}
          growth={summary?.projectsGrowth}
        />
        <StatCard
          title="Người dùng"
          value={summary?.totalUsers ?? 0}
          growth={summary?.usersGrowth}
        />
        <StatCard
          title="CV hôm nay"
          value={summary?.newCvsToday ?? 0}
        />
      </div>

      {/* CHART + ACTIVITY */}
      <div className="grid grid-cols-3 gap-6">

        {/* CHART */}
        <div className="col-span-2 bg-white/70 dark:bg-gray-800/70
          backdrop-blur-md rounded-3xl p-6 shadow-lg border
          border-gray-200 dark:border-gray-700 h-[380px]">

          <h2 className="font-semibold mb-4">Biểu đồ CV</h2>

          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={dashboard.cvChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#6366f1"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ACTIVITY */}
        <div className="bg-white/70 dark:bg-gray-800/70
          backdrop-blur-md rounded-3xl p-6 shadow-lg border
          border-gray-200 dark:border-gray-700 h-[380px] overflow-y-auto">

          <h2 className="font-semibold mb-4">Hoạt động gần đây</h2>

          {activities.map((activity, index) => (
            <div
              key={index}
              className="mb-3 p-3 rounded-xl hover:bg-gray-100
              dark:hover:bg-gray-700 cursor-pointer transition"
            >
              <p className="text-sm font-medium">
                • {formatActivityType(activity.type)}
              </p>
              <p className="text-xs text-gray-500">
                → {activity.title} –{" "}
                {formatTimeAgo(activity.minutesAgo)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* SYSTEM STATUS */}
      <div className="grid grid-cols-2 gap-6">
        <StatusCard title="API" status={systemStatus.api} />
        <StatusCard title="Database" status={systemStatus.database} />
      </div>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  growth,
}: {
  title: string;
  value: number;
  growth?: number;
}) => {
  const isUp = growth && growth >= 0;

  return (
    <div className="bg-white/70 dark:bg-gray-800/70
      backdrop-blur-md rounded-3xl p-6 shadow-lg border
      border-gray-200 dark:border-gray-700">

      <p className="text-sm text-gray-500">{title}</p>

      <p className="mt-2 text-3xl font-bold text-indigo-600">
        {value}
      </p>

      {growth !== undefined && (
        <p
          className={`text-xs mt-2 font-medium ${
            isUp ? "text-green-500" : "text-red-500"
          }`}
        >
          {isUp ? "↑" : "↓"} {Math.abs(growth)}% so với hôm qua
        </p>
      )}
    </div>
  );
};

const StatusCard = ({ title, status }: any) => {
  const isOnline =
    status === "ONLINE" || status === "CONNECTED";

  return (
    <div className="bg-white/70 dark:bg-gray-800/70
      backdrop-blur-md rounded-3xl p-6 shadow-lg border
      border-gray-200 dark:border-gray-700 flex justify-between">

      <span>{title}</span>
      <span
        className={`px-3 py-1 rounded-full text-sm font-semibold ${
          isOnline
            ? "bg-green-100 text-green-600"
            : "bg-red-100 text-red-600"
        }`}
      >
        {status}
      </span>
    </div>
  );
};

export default DashBoard;