import { fetcher } from "@/api/FetcherAdmin";
import { ReactNode } from "react";

export type ProjectStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";


export type ProjectDetailResponse = {
  id: number;
  name: string;
  description: string;
  status: ProjectStatus;
  create_by: string;
  members: {
    id: number;
    fullname: string;
    email: string;
    role: "LEAD" | "USER";
  }[];
};

type BaseResponse<T> = {
  code: string;
  message: string;
  data: T;
};


/**
 * GET /api/user/project/{id}
 */
export const getLeadProjectDetail = (id: number) => {
  return fetcher<ProjectDetailResponse>({
    url: `/user/project/${id}`,
    method: "GET",
  });
};

// Trong file service (ví dụ: user.api.ts)
export const getMyProjectDetail = () => {
  // Đối với User, ID thường được Backend lấy từ Token nên có thể không cần truyền ID
  // Hoặc nếu cần ID, bạn lấy từ thông tin User trong Context/LocalStorage
  return fetcher<ProjectDetailResponse>({
    url: `/user/project`, // Đường dẫn tới API của bạn
    method: "GET",
  });
};
