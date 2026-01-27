import { fetcher } from '@/api/Fetcher';
import { API_CONFIG, STORAGE_KEYS } from '@/config';
import { type ApiResponse } from '@/api/ApiResponse';

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    username: string;
    fullName: string;
  };
}

export interface CheckEmailRequest {
  email: string;
}

export interface CheckEmailResponse {
  code: string;
  message: string;
  userId: number;
}

export interface CheckOTPRequest {
  userId: number;
  otp: string;
}

export interface CheckOTPResponse {
  code: string;
  message: string;
  resetToken: string;
}

export interface ResetPasswordRequest {
  newPassword: string;
  retypeNewPassword: string;
  resetToken: string;
}

export interface ResetPasswordResponse {
  code: string;
  message: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  retypeNewPassword: string;
}

class AuthService {
  /**
   * Login user with username and password
   * POST /auth/login
   */
  async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await fetcher.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        data
      );

      if (response.success && response.data) {
        fetcher.saveAuthTokens(
          response.data.accessToken,
          response.data.refreshToken
        );
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Register new user
   * POST /auth/register
   */
  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await fetcher.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.REGISTER,
        data
      );

      if (response.success && response.data) {
        fetcher.saveAuthTokens(
          response.data.accessToken,
          response.data.refreshToken
        );
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Logout user
   * POST /auth/logout
   */
  async logout(): Promise<void> {
    try {
      await fetcher.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, {}, { requiresAuth: true });

    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      fetcher.logout();
    }
  }

  /**
   * Step 1: Check email and send OTP
   * POST /forgot/checkmail
   * Request: { email: string }
   * Response: { code: string, message: string, userId: number }
   */
  async checkEmail(data: CheckEmailRequest): Promise<ApiResponse<CheckEmailResponse>> {
    return fetcher.post<CheckEmailResponse>(
      API_CONFIG.ENDPOINTS.FORGOT.CHECK_EMAIL,
      data
    );
  }

  async resendOtp(data: CheckEmailRequest): Promise<ApiResponse<CheckEmailResponse>> {
    return fetcher.post<CheckEmailResponse>(
      API_CONFIG.ENDPOINTS.FORGOT.CHECK_EMAIL,
      data
    );
  }

  /**
   * Step 2: Verify OTP and get reset token
   * POST /forgot/checkotp
   * Request: { userId: number, otp: string }
   * Response: { code: string, message: string, resetToken: string }
   */
  async checkOTP(data: CheckOTPRequest): Promise<ApiResponse<CheckOTPResponse>> {
    return fetcher.post<CheckOTPResponse>(
      API_CONFIG.ENDPOINTS.FORGOT.CHECK_OTP,
      data
    );
  }

  /**
   * Step 3: Reset password with reset token
   * POST /forgot/resetpassword
   * Request: { newPassword: string, retypeNewPassword: string, resetToken: string }
   * Response: { code: string, message: string }
   */
  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<ResetPasswordResponse>> {
    return fetcher.post<ResetPasswordResponse>(
      API_CONFIG.ENDPOINTS.FORGOT.RESET_PASSWORD,
      data
    );
  }

  /**
   * Change password (requires authentication)
   * POST /users/change-password
   * Request: { oldPassword: string, newPassword: string, retypeNewPassword: string }
   * Note: After successful password change, all accessTokens and refreshTokens will be disabled
   */
  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<{ message: string }>> {
    const response = await fetcher.post<{ message: string }>(
      API_CONFIG.ENDPOINTS.USER.CHANGE_PASSWORD,
      data,
      { requiresAuth: true }
    );

    // If password change is successful, logout and clear tokens
    if (response.success) {
      fetcher.logout();
    }

    return response;
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser() {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }


/* Lấy mã token*/

  getAccessToken() {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  getRefreshToken() {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  saveTokens(accessToken: string, refreshToken: string) {
    fetcher.saveAuthTokens(accessToken, refreshToken);
  }

  clearTokens() {
    fetcher.logout();
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  /* Kiểm tra bảo mật */

  /**
   * Kiểm tra trạng thái bảo mật
   * - Thử gọi API hồ sơ
   * - Nếu không được, thử làm mới token
   * - Nếu làm mới không được, đăng xuất
   */
  async checkAuth(): Promise<boolean> {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();

    if (!accessToken || !refreshToken) {
      this.clearTokens();
      return false;
    }

    try {
      await this.getProfile();
      return true;
    } catch (error: any) {
      if (error?.status === 401) {
        return this.refreshAccessToken();
      }
      this.clearTokens();
      return false;
    }
  }

  /**
   * Refresh access token using refresh token
   * POST /auth/refresh
   */
  async refreshAccessToken(): Promise<boolean> {
    try {
      const response = await fetcher.post<RefreshTokenResponse>(
        API_CONFIG.ENDPOINTS.AUTH.REFRESH,
        {
          refreshToken: this.getRefreshToken(),
        }
      );

      if (response.success && response.data?.accessToken) {
        fetcher.saveAuthTokens(
          response.data.accessToken,
          this.getRefreshToken()!
        );
        return true;
      }

      this.clearTokens();
      return false;
    } catch {
      this.clearTokens();
      return false;
    }
  }

  /**
   * Get current user profile (protected API)
   * GET /auth/me
   */
  async getProfile() {
    return fetcher.get(
      API_CONFIG.ENDPOINTS.AUTH.PROFILE,
      { requiresAuth: true }
    );
  }

  async logout(): Promise<void> {
    try {
      await fetcher.post(
        API_CONFIG.ENDPOINTS.AUTH.LOGOUT,
        {},
        { requiresAuth: true }
      );
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearTokens();
    }
  }
}
export const authService = new AuthService();
export default authService;
