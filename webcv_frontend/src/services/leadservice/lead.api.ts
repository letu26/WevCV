import { fetcher } from "@/api/FetcherAdmin";
import { ReactNode } from "react";

/* =======================
   ENUM / TYPE
======================= */

export type CvStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";

export type ProjectStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";

/* =======================
   PAGINATION (GIỐNG ADMIN)
======================= */

export type Sort = {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
};

export type Pageable = {
  pageNumber: number;
  pageSize: number;
  offset: number;
  paged: boolean;
  unpaged: boolean;
  sort: Sort;
};

export type PageResponse<T> = {
  content: T[];

  pageable: Pageable;

  last: boolean;
  first: boolean;

  totalElements: number;
  totalPages: number;

  size: number;
  number: number;
  numberOfElements: number;

  sort: Sort;
  empty: boolean;
};

/* =======================
   CV RESPONSE
======================= */

export type CvResponse = {
  fullName: ReactNode;
  userId: number;
  title: ReactNode;
  id: number;
  fullname: string;
  email: string;
  status: CvStatus;
};

export type CvDetailResponse = {
  id: number;
  title: string;
  description: string;
  skills: string[];
};

export type CvPageResponse = PageResponse<CvResponse>;

/* =======================
   PROJECT RESPONSE
======================= */

export type ProjectResponse = {
  id: number;
  name: string;
  description: string;
  status: ProjectStatus;
};

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

/* =======================
   API CV - LEAD
======================= */

/**
 * GET /api/lead/cvs
 */
export const getAllCvs = (
  page = 0,
  size = 10,
  status?: CvStatus,
  keyword?: string
) => {
  return fetcher<CvPageResponse>({
    url: "/lead/cvs",
    method: "GET",
    params: {
      page,
      size,
      ...(status && { status }),
      ...(keyword && { keyword }),
    },
  });
};

/**
 * GET /api/lead/cvs/{userId}
 */
export const getCvByUserId = (userId: number) => {
  return fetcher<BaseResponse<CvDetailResponse[]>>({
    url: `/lead/cvs/${userId}`,
    method: "GET",
  });
};

/**
 * POST /api/lead/projects/{projectId}/apply
 */
export type ApplyCvRequest = {
  cvId: number;
};

export const applyCvToProject = (
  projectId: number,
  data: ApplyCvRequest
) => {
  return fetcher<BaseResponse<any>>({
    url: `/lead/projects/${projectId}/apply`,
    method: "POST",
    data,
  });
};

/**
 * DELETE /api/lead/projects/{projectId}/members/{cvId}
 */
export const removeMemberFromProject = (
  projectId: number,
  cvId: number
) => {
  return fetcher<string>({
    url: `/lead/projects/${projectId}/members/${cvId}`,
    method: "DELETE",
  });
};

/* =======================
   API PROJECT - LEAD
======================= */

/**
 * GET /api/lead/project
 */
export const getLeadProjects = (
  page = 0,
  size = 10
) => {
  return fetcher<PageResponse<ProjectResponse>>({
    url: "/lead/project",
    method: "GET",
    params: {
      page,
      size,
    },
  });
};

/**
 * GET /api/lead/project/{id}
 */
export const getLeadProjectDetail = (id: number) => {
  return fetcher<ProjectDetailResponse>({
    url: `/lead/project/${id}`,
    method: "GET",
  });
};