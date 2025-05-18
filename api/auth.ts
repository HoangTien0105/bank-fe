"use client";

import {
  LoginResponse,
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