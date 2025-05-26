import axiosInstance from "@/config/axios";
import { PaginationRequest } from "@/types/pagination";
import { UpdateAlertStatusRequest } from "@/types/alert";

export const getAllAlerts = async (
  paginationParams: PaginationRequest = {}
) => {
  try {
    const {
      offset = 0,
      limit = 10,
      keyword
    } = paginationParams;

    const params = new URLSearchParams();
    params.append("offset", offset.toString());
    params.append("limit", limit.toString());

    if (keyword) params.append("keyword", keyword);

    const response = await axiosInstance.get(`/alerts?${params.toString()}`);
    return response.data.response;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getAlertById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/alerts/${id}`);
    return response.data.response;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateAlertStatus = async (
  id: string,
  data: UpdateAlertStatusRequest
) => {
  try {
    const response = await axiosInstance.put(`/alerts/${id}/status`, data);
    return response.data.response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};