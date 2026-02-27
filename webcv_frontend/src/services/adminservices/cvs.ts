import { fetcher } from "@/api/FetcherAdmin";
import { PageResponse, SuccessResponse } from "./users";

export type CvStatus = "ACTIVE" | "INACTIVE";

export type Cv = {
  id: number;
  title: string;
  status: CvStatus;
  deleted: boolean;
  userId?: number;
  createdAt: string;
};

export type CvPageResponse = PageResponse<Cv>;

export const getCvs = (
  page = 0,
  size = 8,
  deleted?: boolean,
  status?: string,
  keyword?: string
) => {
  return fetcher<CvPageResponse>({
    url: "/admin/cv",
    method: "GET",
    params: {
      page,
      size,
      ...(deleted !== undefined && { deleted }),
      ...(status && { status }),
      ...(keyword && { keyword }),
    },
  });
};

export const getCvDetail = (id: number) => {
  return fetcher<Cv>({
    url: `/admin/cv/${id}`,
    method: "GET",
  });
};

export const updateCvStatus = (id: number, status: CvStatus) => {
  return fetcher<SuccessResponse>({
    url: `/admin/cv/${id}/status`,
    method: "PATCH",
    data: { status },
  });
};

export const deleteCv = (id: number) => {
  return fetcher<SuccessResponse>({
    url: `/admin/cv/${id}`,
    method: "DELETE",
  });
};

export const assignUserToCv = (cvId: number, userId: number) => {
  return fetcher<SuccessResponse>({
    url: `/admin/cv/${cvId}/user/${userId}`,
    method: "POST",
  });
};