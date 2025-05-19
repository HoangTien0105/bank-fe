import axiosInstance from "@/config/axios";

export const getAllTransactions = async () => {
  try {
    const response = await axiosInstance.get("/transactions");
    return response.data.response;
  } catch (error) {
    console.log(error);
    throw new Error("Error getting all transactions");
  }
};
