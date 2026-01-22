import { fetcher } from "@/api/Fetcher";
import type { ApiResponse } from "@/api/ApiResponse";

//định nghĩa kiểu dữ liệu gửi lên khi đăng ký
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
