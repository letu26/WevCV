import { API_CONFIG, STORAGE_KEYS } from '@/config';
import { ApiError, ApiResponse } from '@/api/ApiResponse';

interface FetcherOptions extends RequestInit {
  requiresAuth?: boolean;
  customHeaders?: Record<string, string>;
}

class Fetcher {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  private getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  }

  private clearTokens(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  private async refreshAccessToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return null;

    try {
      const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

//Đính kèm token nếu có
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");//Lấy token từ localStorage

  if (token) {
     config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

//Hàm fetch api chung (bao gồm các phương thức get, post, put, delete)
export const fetcher = async <T,>(
  config: AxiosRequestConfig,
): Promise<T> => {
  const response = await apiClient.request<T>(config);
  return response.data;
};