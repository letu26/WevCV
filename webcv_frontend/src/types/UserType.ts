export interface User {
  id: string;
  email: string;
  username: string;
  fullName?: string;
  phone?: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt?: string;
}

export interface Project {
  name: string;
  description: string;
  role?: string;
  technologies?: string[];
}

export interface CV {
  id: string;
  userId: string;
  email: string;
  fullName?: string;
  phone?: string;
  address?: string;
  education?: string;
  experience?: string;
  projects: Project[];
  skills: string[];
  status: 'draft' | 'pending' | 'accepted' | 'rejected';
  careerGoal?: string;
  additionalInfo?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
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

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  phone?: string;
  email?: string;
}
