import { auth } from "@/auth";
import { BASE_API_URL } from "@/constant/api";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const timeoutDuration = 60 * 1000;

const axiosInstance = axios.create({
  baseURL: BASE_API_URL,
  timeout: timeoutDuration,
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    // console.log("--Before request--");
    // console.log("Config", config);

    if (config.url?.includes("/auth/login")) {
      return config;
    }

    const session = await auth();
    const user = session?.user;

    if (!user) {
      if (config.url?.includes("/auth/logout")) {
        return config;
      }
      return config;
    }

    try {
      const decodedToken = jwtDecode(user.accessToken);
      const tokenExp = decodedToken.exp as number; // Thời gian hết hạn thực tế của access token

      const now = Math.floor(Date.now() / 1000); // Chuyển đổi thành giây
      if (tokenExp < now) {
        console.log("Access token expired");
        // Xử lý refresh token
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
    config.headers.setAuthorization(`Bearer ${user.accessToken}`);

    if (config.responseType !== "blob" && !config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
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
  async (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
