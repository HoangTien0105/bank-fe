import axiosInstance from "@/config/axios";
import { PaginationRequest } from "@/types/pagination";

export const getAllAccounts = async (
  paginationParams: PaginationRequest = {}
) => {
  try {
    const { offset = 0, limit = 10, keyword } = paginationParams;

    const params = new URLSearchParams();
    params.append("offset", offset.toString());
    params.append("limit", limit.toString());

    if (keyword) params.append("keyword", keyword);
    const response = await axiosInstance.get(`/accounts?${params.toString()}`);
    return response.data.response;
  } catch (error) {
    console.log(error);
  }
};

export const getAccountById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/accounts/${id}`);
    return response.data.response;
  } catch (error) {
    console.log(error);
  }
};

export const getCheckingAccount = async () => {
  try {
    const response = await axiosInstance.get(`/accounts/customer`);
    return response.data.response;
  } catch (error) {
    console.log(error);
  }
}