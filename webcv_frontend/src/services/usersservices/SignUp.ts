import { fetcher } from "@/api/Fetcher";
import type { ApiResponse } from "@/api/ApiResponse";

export interface SignUpPayload {
  email: string;
  username: string;
  password: string;
  retypePassword: string;
  fullname: string;
}


export async function signUp(
  payload: SignUpPayload,
): Promise<ApiResponse> {
  const res = await fetcher<ApiResponse>({
    url: "/users/register",
    method: "POST",
    data: payload,
  });

  return res;
}
