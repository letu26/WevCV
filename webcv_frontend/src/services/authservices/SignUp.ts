import { fetcher } from "@/api/Fetcher";
import type { ApiResponse } from "@/api/ApiResponse";

export interface SignUpPayload {
  email: string;
  username: string;
  password: string;
  retypePassword: string;
  fullname: string;
}

export interface SignUpResponse {
  id: number;
  email: string;
  fullname: string;
}

export async function signUp(
  payload: SignUpPayload,
): Promise<SignUpResponse> {
  const res = await fetcher<ApiResponse<SignUpResponse>>({
    url: "/auth/signup",
    method: "POST",
    data: payload,
  });

  return res.data;
}
