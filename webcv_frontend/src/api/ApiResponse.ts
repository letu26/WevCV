export interface ApiResponse<T> {
  code: number;      // mã trạng thái do backend quy ước (vd: 200, 400, 401...)
  message: string;   // message trả về từ backend
  data: T;           // dữ liệu thực tế
}
