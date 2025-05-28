import axiosInstance from "@/config/axios";
import { BASE_API_URL } from "@/constant/api";
import axios from "axios";

export const login = async (payload: {
  username: string;
  password: string;
}) => {
  try {
    const response = await axiosInstance.post("/auth/login", payload);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Login failed");
  }
};

export const refreshToken = async () => {
  try {
    const response = await axiosInstance.post("/auth/refreshToken");
    return response.data.response;
  } catch (error) {
    console.log(error);
    throw new Error("Refresh token failed");
  }
};

export async function refreshTokenV2(refreshToken: string) {
  const response = await axios.post(
    `${BASE_API_URL}/auth/refreshToken`,
    {},
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    },
  );

  return response.data.response;
}

export const logout = async () => {
  try {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
  } catch (error) {
    console.error("Logout API error:", error);
    // Không throw error để không block NextAuth logout
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const me = async () => {
  const response = await axiosInstance.get("/auth/me");
  return response.data;
};
