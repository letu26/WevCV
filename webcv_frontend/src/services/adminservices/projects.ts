import { fetcher } from "@/api/FetcherAdmin";
import { PageResponse, SuccessResponse } from "./users";

export type ProjectStatus = "ACTIVE" | "INACTIVE" | "DONE";

export type Project = {
  id: number;
  name: string;
  description: string;
  status: ProjectStatus;
  createdAt: string;
};

export type ProjectPageResponse = PageResponse<Project>;

export type CreateProjectRequest = {
  name: string;
  description: string;
  status: ProjectStatus;
};

export const getProjects = (
  page = 0,
  size = 8,
  status?: string,
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

export const createProject = (data: CreateProjectRequest) => {
  return fetcher<SuccessResponse>({
    url: "/admin/project/create",
    method: "POST",
    data,
  });
};

export const updateProjectStatus = (
  id: number,
  status: ProjectStatus
) => {
  return fetcher<SuccessResponse>({
    url: `/admin/project/${id}/status`,
    method: "PATCH",
    data: { status },
  });
};

export const deleteProject = (id: number) => {
  return fetcher<SuccessResponse>({
    url: `/admin/project/${id}`,
    method: "DELETE",
  });
};