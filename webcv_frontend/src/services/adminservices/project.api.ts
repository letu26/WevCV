import { fetcher } from "@/api/FetcherAdmin";

/* =======================
   ENUM / TYPE CƠ BẢN
======================= */

export type ProjectStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";

export type ProjectMemberRole = "LEAD" | "USER";

/* =======================
   ENTITY
======================= */

export type Project = {
  id: number;
  name: string;
  description: string;
  status: ProjectStatus;
  create_by: string;
};

export type ProjectMember = {
  id: number;
  fullname: string;
  email: string;
  role: ProjectMemberRole;
};

/* =======================
   PAGINATION (GIỐNG USER)
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

export type ProjectPageResponse = PageResponse<Project>;

/* =======================
   RESPONSE CHUNG
======================= */

type SuccessResponse = {
  code: string;
  message: string;
};

/* =======================
   API
======================= */

/**
 * Tạo mới project
 * POST /api/project/create
 */
export type CreateProjectRequest = {
  name: string;
  description: string;
};

export const createProject = (data: CreateProjectRequest) => {
  return fetcher<SuccessResponse>({
    url: "/admin/project/create",
    method: "POST",
    data,
  });
};

/**
 * Danh sách project (có phân trang + filter)
 * GET /project
 */
export const getProjects = (
  page = 0,
  size = 10,
  status?: ProjectStatus,
  keyword?: string
) => {
  return fetcher<ProjectPageResponse>({
    url: "/admin/project",
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
 * Chi tiết project
 * GET /project/{id}
 */
export type ProjectDetailResponse = {
  id: number;
  name: string;
  description: string;
  status: ProjectStatus;
  create_by: string;
  members: ProjectMember[];
};

export const getProjectDetail = (id: number) => {
  return fetcher<ProjectDetailResponse>({
    url: `/admin/project/${id}`,
    method: "GET",
  });
};

/**
 * Cập nhật name + description
 * PUT /project/{id}
 */
export type UpdateProjectRequest = {
  name: string;
  description: string;
};

export const updateProject = (
  id: number,
  data: UpdateProjectRequest
) => {
  return fetcher<SuccessResponse>({
    url: `/admin/project/${id}`,
    method: "PUT",
    data,
  });
};

/**
 * Cập nhật trạng thái project
 * PATCH /project/{id}/status
 */
export type UpdateProjectStatusRequest = {
  status: ProjectStatus;
};

export const updateProjectStatus = (
  id: number,
  data: UpdateProjectStatusRequest
) => {
  return fetcher<SuccessResponse>({
    url: `/admin/project/${id}/status`,
    method: "PATCH",
    data,
  });
};

/**
 * Lấy danh sách LEAD có thể gán
 * GET /project/lead
 */
export type LeadResponse = {
  id: number;
  fullname: string;
  email: string;
  role: "LEAD";
};

export const getLeads = () => {
  return fetcher<LeadResponse[]>({
    url: "/admin/project/lead",
    method: "GET",
  });
};

/**
 * Thêm member vào project
 * POST /project/{id}/member
 */
export type AddProjectMemberRequest = {
  userId: number;
  role: ProjectMemberRole;
};

export const addProjectMember = (
  projectId: number,
  data: AddProjectMemberRequest
) => {
  return fetcher<SuccessResponse>({
    url: `/admin/project/${projectId}/member`,
    method: "POST",
    data,
  });
};
