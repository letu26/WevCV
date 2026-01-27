import { fetcher } from '@/api/Fetcher';
import { API_CONFIG } from '@/config';
import { ApiResponse } from '@/api/ApiResponse';
import { AuthResponse, RegisterRequest, LoginRequest, ForgotPasswordRequest, ResetPasswordRequest } from '@/types/UserType';

export class AuthService {
  /**
   * Register a new user
   */
  static async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await fetcher.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.REGISTER,
        data
      );

      if (response.success && response.data) {
        // Save tokens to localStorage
        fetcher.saveAuthTokens(response.data.accessToken, response.data.refreshToken);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Login user
   */
  static async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await fetcher.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        data
      );

      if (response.success && response.data) {
        // Save tokens to localStorage
        fetcher.saveAuthTokens(response.data.accessToken, response.data.refreshToken);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    try {
      await fetcher.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, {}, { requiresAuth: true });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens regardless of API call success
      fetcher.logout();
    }
  }

  /**
   * Request password reset
   */
  static async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<void>> {
    try {
      return await fetcher.post<void>(
        API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD,
        data
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reset password with token
   */
  static async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<void>> {
    try {
      return await fetcher.post<void>(
        API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD,
        data
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const accessToken = localStorage.getItem('accessToken');
    return !!accessToken;
  }
}

export default AuthService;
