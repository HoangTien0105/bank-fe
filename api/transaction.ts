import axiosInstance from "@/config/axios";
import { PaginationRequest } from "@/types/pagination";

export const getAllTransactions = async (
  paginationParams: PaginationRequest = {}
) => {
  try {
    const { 
      offset = 0, 
      limit = 19, 
      keyword,
      location,
      minAmount,
      maxAmount,
      sortBy,
      sortDirection 
    } = paginationParams;

    // Build query parameters
    const params = new URLSearchParams();
    params.append("offset", offset.toString());
    params.append("limit", limit.toString());

    if(keyword) params.append('keyword', keyword);
    if(location) params.append('location', location);
    if(minAmount !== undefined) params.append('minAmount', minAmount.toString());
    if(maxAmount !== undefined) params.append('maxAmount', maxAmount.toString());
    if(sortBy) params.append('sortBy', sortBy);
    if(sortDirection) params.append('sortDirection', sortDirection);
    
    const response = await axiosInstance.get(`/transactions?${params.toString()}`);
    return response.data.response;
  } catch (error) {
    console.log(error);
    return null;
  }
};
