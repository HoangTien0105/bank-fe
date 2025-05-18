"use client";

import {
  ApiResponse,
  LoginResponse,
  LogoutResponse,
  Token,
} from "@/app/login/_types/auth";
import { BASE_URL } from "@/constant/api";

export async function loginApi(
  username: string,
  password: string
): Promise<Token> {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    
    const data: LoginResponse = await response.json();
    
    if (!data.success) {
      throw new Error(
        (data.message || "Login failed"
      ));
    }

    if(!data.response){
      throw new Error("Invalid response format")
    }
    
    return data.response;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
}

export async function logoutApi(): Promise<void>{
  try{
    const token = localStorage.getItem("auth_token");
    if(!token) throw new Error("No authentication token found");

    const { accessToken } = JSON.parse(token);
    const response = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}` 
           }
    });

    const data : LogoutResponse = await response.json();

    if(!data.success){
            throw new Error(
        (data.message || "Logout failed"
      ));
    }
  } catch(error) {
    console.error("Logout API error: ", error);
    throw error;
  }
}