import { fetcher } from "./Fetcher";

export const refreshToken = () => {
  return fetcher<{
    accessToken: string;
    refreshToken: string;
  }>({
    url: "/auth/refresh",
    method: "POST",
    data: {
      refreshToken: localStorage.getItem("refreshToken"),
    },
  });
};
