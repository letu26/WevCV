import { SuccessResponse } from "@/services/adminservices/users";

export type ColumnType = "left" | "right";

export interface CVBlock {
  id: string;
  type: string;
  title: string;
  data: Record<string, unknown>;
}

export interface CVSavePayload {
  id: string | null;
  title: string;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  layout: {
    left: string[];
    right: string[];
    unused: string[];
  };
  blocks: Array<{
    id: string;
    type: string;
    title: string;
    data: Record<string, unknown>;
  }>;
  visibility: string;
}


export interface CVLayout {
  left: CVBlock[];
  right: CVBlock[];
  unused: CVBlock[];
}

export type DropZone = "left" | "right" | "unused";

export interface CVFetcher extends SuccessResponse{
  data: CVSavePayload[]
}