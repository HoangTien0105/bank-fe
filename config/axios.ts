import { auth } from "@/auth";
import { BASE_API_URL } from "@/constant/api";
import { updateSession } from "@/utils/session";
import axios, { Axios, AxiosError, InternalAxiosRequestConfig } from "axios";
import { signOut } from "next-auth/react";

const timeoutDuration = 60 * 1000;

const axiosInstance = axios.create({
  baseURL: BASE_API_URL,
  timeout: timeoutDuration,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    if (config.url?.includes("/auth/login")) {
      return config;
    }

    const session = await auth();

    const user = session?.user;

    if (user) {
      config.headers.setAuthorization(`Bearer ${user.accessToken}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    // Lưu lại request gốc để thực hiện lại sau khi refresh token
    const originalRequest = error.config as InternalAxiosRequestConfig;

    // Thêm flag để tránh vòng lặp vô hạn
    if (
      error.response?.status === 401 &&
      !originalRequest?.url?.includes("/auth/refresh-token")
    ) {
      try {
        //Lấy refreshToken từ session hiện tại
        const session = await auth();
        const currentRefreshToken = session?.user?.refreshToken;

        if (!currentRefreshToken) {
          // Xử lý trường hợp không có refresh token
          throw new Error("No refresh token available");
        }

        //Gọi API lấy token mới
        const response = await axios.post(
          `${BASE_API_URL}/auth/refresh-token`,
          { currentRefreshToken }
        );

        //Lấy accessToken mới từ response
        const { accessToken, refreshToken, expiresIn } = response.data;

        // Cập nhật session mới
        await updateSession({ accessToken, refreshToken, expiresIn });

        // Cập nhật token mới vào header của request gốc
        if (originalRequest?.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Nếu refresh token thất bại, đăng xuất user
        // return Promise.reject(
        //   new Error("Authentication failed. Please login again.")
        // );
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
