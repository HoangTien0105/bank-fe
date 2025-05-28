import axiosInstance from "@/config/axios";
import { PaginationRequest } from "@/types/pagination";

export const getAllCustomers = async (
  paginationParams: PaginationRequest = {}
) => {
  try {
    const {
      offset = 0,
      limit = 10,
      keyword,
      location,
      sortBy,
      sortDirection,
    } = paginationParams;
    const params = new URLSearchParams();
    params.append("offset", offset.toString());
    params.append("limit", limit.toString());

    if (keyword) params.append("keyword", keyword);
    if (location) params.append("location", location);
    if (sortBy) params.append("sortBy", sortBy);
    if (sortDirection) params.append("sortDirection", sortDirection);

    const response = await axiosInstance.get(`/customers?${params.toString()}`);

    return response.data.response;
  } catch (error) {
    console.log(error);
    throw new Error("Get all customers failed");
  }
};

export const searchCustomer = async (search: string) => {
  try {
    const response = await axiosInstance.get(`/customers/search`, {
      params: { search },
    });
    return response.data.response;
  } catch (error) {
    console.log(error);
    return { results: [] };
  }
};

export const createCustomer = async () => {
  try {
    const response = await axiosInstance.post("/customers");

    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Create customer failed");
  }
};
