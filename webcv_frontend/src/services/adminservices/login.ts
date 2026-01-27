import { fetcher } from "@/api/Fetcher";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  role: string[];
}

export const login = (data: LoginRequest) => {
  return fetcher<LoginResponse>({
    url: "/auth/login", 
    method: "POST",
    data,
  });
};
