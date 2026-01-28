import { API_CONFIG, STORAGE_KEYS } from '@/config';
import { ApiError, type ApiResponse } from '@/api/ApiResponse';

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

      if (!response.ok) {
        this.clearTokens();
        return null;
      }

      const data: ApiResponse<{ accessToken: string; refreshToken: string }> = await response.json();
      if (data.success && data.data) {
        this.setTokens(data.data.accessToken, data.data.refreshToken);
        return data.data.accessToken;
      }

      return null;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      this.clearTokens();
      return null;
    }
  }

  private async request<T>(
    endpoint: string,
    options: FetcherOptions = {}
  ): Promise<ApiResponse<T>> {
    const { requiresAuth = false, customHeaders = {}, ...fetchOptions } = options;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    if (requiresAuth) {
      const accessToken = this.getAccessToken();
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle 401 Unauthorized - try to refresh token
      if (response.status === 401 && requiresAuth) {
        const newAccessToken = await this.refreshAccessToken();
        if (newAccessToken) {
          // Retry the request with new token
          headers['Authorization'] = `Bearer ${newAccessToken}`;
          const retryResponse = await fetch(`${this.baseURL}${endpoint}`, {
            ...fetchOptions,
            headers,
          });

          if (retryResponse.ok) {
            return await retryResponse.json();
          }
        }

        // If refresh failed, redirect to login
        this.clearTokens();
        throw new ApiError(401, 'Session expired. Please login again.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          response.status,
          data.message || 'An error occurred',
          data.errors
        );
      }

      return {
        success: response.ok,
        data: data as T,
        message: data.message
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError(408, 'Request timeout');
        }
        throw new ApiError(500, error.message);
      }

      throw new ApiError(500, 'An unexpected error occurred');
    }
  }

  async get<T>(endpoint: string, options?: FetcherOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, body?: any, options?: FetcherOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(endpoint: string, body?: any, options?: FetcherOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(endpoint: string, body?: any, options?: FetcherOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: FetcherOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  // Helper method to save tokens after login/register
  saveAuthTokens(accessToken: string, refreshToken: string): void {
    this.setTokens(accessToken, refreshToken);
  }

  // Helper method to logout
  logout(): void {
    this.clearTokens();
  }
}

/**
import Redis from 'ioredis';

// Tạo kết nối Redis
const redis = new Redis({
  host: 'localhost',  // Địa chỉ Redis
  port: 6379,         // Cổng Redis
});

private async saveAuthTokens(accessToken: string, refreshToken: string): Promise<void> {
  // Lưu vào Redis với key là 'accessToken' và 'refreshToken'
  await redis.set('accessToken', accessToken);
  await redis.set('refreshToken', refreshToken);
}
 */

// Export singleton instance
export const fetcher = new Fetcher();
export default fetcher;
