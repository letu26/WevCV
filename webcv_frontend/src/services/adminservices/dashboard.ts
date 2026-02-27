import apiClient from "@/api/FetcherAdmin";
import {
  DashboardResponse,
  RecentActivity,
  SystemStatus,
  RangeType,
} from "@/api/ApiDashboardAdmin";

export type RangeType = "DAY" | "WEEK" | "MONTH";

export const getDashboard = async (
  range: RangeType = "DAY"
) => {
  return apiClient.get<DashboardResponse>("/admin/dashboard", {
    params: { range },
  });
};

export const getRecentActivities = async (limit = 5) => {
  return apiClient.get<RecentActivity[]>(
    "/admin/dashboard/recent-activities",
    { params: { limit } }
  );
};

export const getSystemStatus = async () => {
  return apiClient.get<SystemStatus>("/admin/system/status");
};