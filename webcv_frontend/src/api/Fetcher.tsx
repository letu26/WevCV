import axios, { type AxiosRequestConfig } from "axios";
import { API_URL } from "@/config";

// ===== axios instance =====
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// ===== request interceptor =====
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token && token !== "null" && token !== "undefined") {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

// ===== response interceptor (REFRESH TOKEN) =====
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // chỉ xử lý 401 & tránh loop vô hạn
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        // gọi API refresh
        const res = await axios.post(
          `${API_URL}/auth/refresh`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = res.data;

        // lưu token mới
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        // gắn token mới & retry request cũ
        originalRequest.headers.Authorization =
          `Bearer ${accessToken}`;

        return apiClient(originalRequest);
      } catch (err) {
        // refresh fail → logout
        localStorage.clear();
        window.location.href = "/admin/login";
      }
    }

    return Promise.reject(error);
  }
);

// ===== fetcher chung =====
export const fetcher = async <T,>(
  config: AxiosRequestConfig
): Promise<T> => {
  const response = await apiClient.request<T>(config);
  return response.data;
};