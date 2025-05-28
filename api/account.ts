import axiosInstance from "@/config/axios";
import { CreateSavingAccountRequest } from "@/types/accounts";
import { PaginationRequest } from "@/types/pagination";

export const getAllAccounts = async (
  paginationParams: PaginationRequest = {}
) => {
  try {
    const {
      offset = 0,
      limit = 10,
      keyword,
      balanceType,
      accountType,
      sortBy,
      sortDirection,
    } = paginationParams;

    const params = new URLSearchParams();
    params.append("offset", offset.toString());
    params.append("limit", limit.toString());

    if (keyword) params.append("keyword", keyword);
    if (balanceType) params.append("balanceType", balanceType);
    if (accountType) params.append("accountType", accountType);
    if (sortBy) params.append("sortBy", sortBy);
    if (sortDirection) params.append("sortDirection", sortDirection);
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
};

export const getSavingTermsApi = async () => {
  try {
    const response = await axiosInstance.get(`/interest-rates`);
    return response.data.response;
  } catch (error) {
    console.log(error);
  }
};

export const createSavingAccountApi = async (
  data: CreateSavingAccountRequest
) => {
  try {
    const response = await axiosInstance.post("/accounts/saving", data);
    return response.data.response;
  } catch (error) {
    console.log(error);
  }
};

export const calculateInterestRate = async (params: {
  principal: number;
  months: number;
  annualRate: number;
  monthlyDeposit: number;
}) => {
  try {
    const { principal, months, annualRate, monthlyDeposit } = params;
    const queryParams = new URLSearchParams();
    queryParams.append("principal", principal.toString());
    queryParams.append("months", months.toString());
    queryParams.append("annualRate", annualRate.toString());

    if (monthlyDeposit != null) {
      if (monthlyDeposit != 0) {
        queryParams.append("monthlyDeposit", monthlyDeposit.toString());
      }
    }

    const response = await axiosInstance.get(
      `/interest-rates/calculate?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
