import axiosInstance from "@/config/axios";
import { PaginationRequest } from "@/types/pagination";
import { redirect } from "next/navigation";

export const getAllTransactions = async (
  paginationParams: PaginationRequest = {}
) => {
  try {
    const { offset = 0, limit = 19, keyword } = paginationParams;

    // Build query parameters
    const params = new URLSearchParams();
    params.append("offset", offset.toString());
    params.append("limit", limit.toString());

    if(keyword) params.append('keyword', keyword);
    const response = await axiosInstance.get(`/transactions?${params.toString()}`);
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
