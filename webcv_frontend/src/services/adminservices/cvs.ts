import { fetcher } from "@/api/FetcherAdmin";
import { CVFetcher } from "@/types/cv";

//lấy toàn bộ danh sách cv của tất cả người dùng
export const getAllCvs = (lastID: number | null, size: number | null, status: string | null, keyword: string | null) => {
  return fetcher<CVFetcher>({
    url: `/admin/cvs?lastID=${lastID || 0}&size=${size || 10}&status=${status || ''}&keyword=${keyword || ''}`,
    method: "GET",
  });
}