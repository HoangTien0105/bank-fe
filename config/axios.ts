import { refreshTokenV2 } from "@/api/auth";
import { auth } from "@/auth";
import { BASE_API_URL } from "@/constant/api";
import { updateSession, updateSessionV2 } from "@/utils/session";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

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

    const session = await auth();
    const user = session?.user;

    console.log("Session:", session);

    // if (config.responseType !== "blob" && !config.headers["Content-Type"]) {
    //   config.headers["Content-Type"] = "application/json";
    // }

    if (!user) return config;

    const skipAuthPaths = ["/auth/login", "/auth/logout", "/auth/refreshToken"];
    if (skipAuthPaths.some((path) => config.url?.includes(path))) {
      return config;
    }

    const decodedToken = jwtDecode(user.accessToken);
    const tokenExp = decodedToken.exp as number;

    const now = Math.floor(new Date().getTime() / 1000);
    console.log("Current time:", now);
    console.log("Expired token time:", tokenExp);

    if (tokenExp < now) {
      try {
        console.log("Access token expired");
        const data = await refreshTokenV2(user.refreshToken);
        console.log("Access token after refresh:", data.accessToken);
        await updateSessionV2(data);
        config.headers.setAuthorization(`Bearer ${data.accessToken}`);

        return config;
      } catch (error) {
        console.error(error);
        throw error;
      }
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
    return response;
  },
  async (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
