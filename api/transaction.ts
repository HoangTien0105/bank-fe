import axiosInstance from "@/config/axios";
import { PaginationRequest } from "@/types/pagination";
import { DepositOrWithdrawRequest, TransferRequest } from "@/types/transaction";

export const getTransactionsByAccountById = async (
  id: string,
  paginationParams: PaginationRequest = {}
) => {
  try {
    const { offset = 0, limit = 10 } = paginationParams;
    const params = new URLSearchParams();
    params.append("offset", offset.toString());
    params.append("limit", limit.toString());

    const response = await axiosInstance.get(
      `/transactions/account/${id}?${params.toString()}`
    );
    return response.data.response;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getAllTransactions = async (
  paginationParams: PaginationRequest = {}
) => {
  try {
    const {
      offset = 0,
      limit = 10,
      keyword,
      location,
      minAmount,
      maxAmount,
      sortBy,
      sortDirection,
    } = paginationParams;

    // Build query parameters
    const params = new URLSearchParams();
    params.append("offset", offset.toString());
    params.append("limit", limit.toString());

    if (keyword) params.append("keyword", keyword);
    if (location) params.append("location", location);
    if (minAmount !== undefined)
      params.append("minAmount", minAmount.toString());
    if (maxAmount !== undefined)
      params.append("maxAmount", maxAmount.toString());
    if (sortBy) params.append("sortBy", sortBy);
    if (sortDirection) params.append("sortDirection", sortDirection);

    const response = await axiosInstance.get(
      `/transactions?${params.toString()}`
    );
    return response.data.response;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getTransactionById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/transactions/${id}`);
    return response.data.response;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const transferMoney = async (transferData: TransferRequest) => {
  try {
    const response = await axiosInstance.post(
      "/transactions/transfer",
      transferData
    );
    return response.data.response;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const depositMoney = async (depositData: DepositOrWithdrawRequest) => {
  try {
    const response = await axiosInstance.post(
      "/transactions/deposit",
      depositData
    );
    return response.data.response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const withdrawMoney = async (withdrawData: DepositOrWithdrawRequest) => {
  try {
    const response = await axiosInstance.post(
      "/transactions/withdraw",
      withdrawData
    );
    return response.data.response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
