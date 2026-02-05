import { fetcher } from "@/api/FetcherAdmin";

export type User = {
  id: number;
  username: string;
  fullname: string;
  email: string;
  status: "ACTIVE" | "INACTIVE";
  roles: ("ADMIN" | "LEAD" | "USER")[];
};

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

export type UserPageResponse = PageResponse<User>;

export const getUsers = (
  page = 0,
  size = 9,
  role?: string,
  status?: string,
  keyword?: string
) => {
  return fetcher<UserPageResponse>({
    url: "/admin/account",
    method: "GET",
    params: {
      page,
      size,
      ...(role && { role }),
      ...(status && { status }),
      ...(keyword && {keyword}
      )
    },
  });
};

export type Role = "ADMIN" | "LEAD" | "USER";
export type UserStatus = "ACTIVE" | "INACTIVE";

export type CreateUserRequest = {
  username: string;
  password: string;
  roles: Role[];
  status: UserStatus;
  email: string;
  fullname: string;
}

export type SuccessResponse = {
  code: string;
  message: string;
}

//tạo mới người dùng
export const createUser = (data: CreateUserRequest) => {
  return fetcher<SuccessResponse>({
    url: "/admin/account/create",
    method: "POST",
    data,
  });
};

export type UpdateRole = {
  roles: Role[]
}
//phân quyền người dùng
export const editRoles = (data: UpdateRole, id: number) => {
  return fetcher<SuccessResponse>({
    url: `/admin/account/${id}/roles`,
    method: "PUT",
    data,
  })
}

export type UpdateStatus = {
  status: string
}
//cập nhật trạng thái
export const editStatus = (data: UpdateStatus, id: number) => {
  return fetcher<SuccessResponse>({
    url: `/admin/account/${id}/status`,
    method: "PUT",
    data
  })
}