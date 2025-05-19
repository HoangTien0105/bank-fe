import axiosInstance from "@/config/axios";
import { redirect } from "next/navigation";

export const getAllTransactions = async () => {
  try {
    const response = await axiosInstance.get("/transactions");
    return response.data.response;
  } catch (error) {
    console.log(error);
    if (
      error instanceof Error &&
      error.message === "Authentication failed. Please login again."
    ) {
      redirect("/login");
    }
    throw new Error("Error getting all transactions");
  }
};
