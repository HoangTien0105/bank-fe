import { auth } from "@/auth";
import { BASE_API_URL } from "@/constant/api";
import axios from "axios";

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
    console.log("--Before request--");
    console.log("Config", config);

    if (config.url?.includes("/auth/login")) {
      return config;
    }

    const session = await auth();
    const user = session?.user;

    if (!user) return config;

    const expiredTime = user.exp;
    const now = new Date().getTime();

    if (expiredTime < now) {
      console.log("Access token expired");
    }

    config.headers.setAuthorization(`Bearer ${user.accessToken}`);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("--After response--");
    return response;
  },
  async (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
