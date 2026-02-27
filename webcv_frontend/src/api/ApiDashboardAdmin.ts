export type RangeType = "DAY" | "WEEK" | "MONTH";

export interface ChartPoint {
  date: string;
  count: number;
}

export interface DashboardResponse {
  summary: {
    totalCvs: number;
    totalProjects: number;
    totalUsers: number;
    newCvsToday: number;
    cvGrowthPercent: number;
  };
  cvChart: ChartPoint[];
  projectChart: ChartPoint[];
  userChart: ChartPoint[];
}

export interface RecentActivity {
  type: string;
  title: string;
  minutesAgo: number;
}

export interface SystemStatus {
  database: string;
  api: string;
  timestamp: string;
}