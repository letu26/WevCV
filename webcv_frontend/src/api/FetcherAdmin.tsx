import axios, { type AxiosRequestConfig } from "axios";
import { API_URL } from "@/config";

//Tạo một instance axios riêng, tự reject nếu quá 10s không có phản hồi
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

//Đính kèm token nếu có
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");//Lấy token từ localStorage

  if (token) {
     config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

//Hàm fetch api chung (bao gồm các phương thức get, post, put, delete)
export const fetcher = async <T,>(
  config: AxiosRequestConfig,
): Promise<T> => {
  const response = await apiClient.request<T>(config);
  return response.data;
};