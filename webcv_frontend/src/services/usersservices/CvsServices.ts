import {fetcher} from "@/api/FetcherAdmin";
import { CVFetcher, CVSavePayload } from "@/types/cv";
import { SuccessResponse } from "../adminservices/users";


//tạo mới và cập nhật cvs
export const createAndUpdateCv = (data : CVSavePayload) => {
  return fetcher<SuccessResponse>({
    url: "/cvs",
    method: "POST",
    data: {
      ...data,
      layout: JSON.stringify(data.layout),
      blocks: JSON.stringify(data.blocks),
    },
  });
};

//lấy danh sách cv theo người dùng
export const getCvList = () => {
  return fetcher<CVFetcher>({
    url: "/cvs",
    method: "GET",
  });
};


