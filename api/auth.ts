import { LoginResponse, Token } from "@/app/login/_types/auth";
import axiosInstance from "@/config/axios";
import { BASE_API_URL } from "@/constant/api";

export async function loginApi(
  username: string,
  password: string,
): Promise<Token> {
  try {
    const response = await fetch(`${BASE_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data: LoginResponse = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Login failed");
    }

    if (!data.response) {
      throw new Error("Invalid response format");
    }

    return data.response;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
}

export const login = async (payload: {
  username: string;
  password: string;
}) => {
  try {
    const response = await axiosInstance.post("/auth/login", payload);
    console.log("Response data:", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Login failed");
  }
};
