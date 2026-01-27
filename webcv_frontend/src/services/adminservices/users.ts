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
  status?: string
) => {
  return fetcher<UserPageResponse>({
    url: "/admin/account",
    method: "GET",
    params: {
      page,
      size,
      ...(role && { role }),
      ...(status && { status }),
    },
  });
};