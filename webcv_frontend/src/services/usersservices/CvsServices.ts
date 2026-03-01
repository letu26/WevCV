import { apiClient, fetcher } from "@/api/FetcherAdmin";
import { CVFetcher, CVSavePayload } from "@/types/cv";
import { SuccessResponse } from "../adminservices/users";


//tạo mới và cập nhật cvs
export const createAndUpdateCv = (data : CVSavePayload) => {
  return fetcher<SuccessResponse>({
    url: "/cvs",
    method: "POST",
    data: {
      id: data.id,
      title: data.title,
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

//xóa cv
export const deleteCv = (id: number) => {
  return fetcher<SuccessResponse>({
    url: `/cvs/${id}`,
    method: "DELETE",
  });
}

//xuất pdf
export const exportCvPdf = async (id: string) => {
  const response = await apiClient.get(`/cvs/${id}/export-pdf`, {
    responseType: "blob",
    timeout: 60000,
  });
  return response.data as Blob;
};

export type PdfJobStatus = "QUEUED" | "RUNNING" | "DONE" | "FAILED";

export type PdfJobInfo = {
  jobId: string;
  cvId: number;
  status: PdfJobStatus;
  fileName: string;
  error?: string | null;
  createdAt?: string;
  startedAt?: string | null;
  finishedAt?: string | null;
};

export type PdfJobResponse = SuccessResponse & {
  data: PdfJobInfo;
};

export const createCvPdfJob = (id: string) => {
  return fetcher<PdfJobResponse>({
    url: `/cvs/${id}/export-pdf/jobs`,
    method: "POST",
  });
};

export const getPdfJob = (jobId: string) => {
  return fetcher<PdfJobResponse>({
    url: `/pdf-jobs/${jobId}`,
    method: "GET",
  });
};

export const downloadPdfJob = async (jobId: string) => {
  const response = await apiClient.get(`/pdf-jobs/${jobId}/download`, {
    responseType: "blob",
    timeout: 120000,
  });
  return response.data as Blob;
};

export type ShareLinkResponse = SuccessResponse & {
  data: string;
};

export const getCvShareLink = (id: string | number) => {
  return fetcher<ShareLinkResponse>({
    url: `/cvs/${id}/link`,
    method: "GET",
  });
};

export type VisibilityRequest = {
  cvId: string | number;
  visibility: string;
};
export const updateCvVisibility = (
  data: VisibilityRequest
) => {
  return fetcher<SuccessResponse>({
    url: "/cvs/visibility",
    method: "PUT",
    data: { cvId: data.cvId, visibility: data.visibility },
  });
};

export type SharedCvResponse = SuccessResponse & {
  data: CVSavePayload;
};

export const getSharedCvByToken = (token: string) => {
  return fetcher<SharedCvResponse>({
    url: `/cvs/share-cv/${token}`,
    method: "GET",
  });
};