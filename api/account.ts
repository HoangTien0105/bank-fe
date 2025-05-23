import axiosInstance from "@/config/axios";

export const getAllAccounts = async () => {
  try {
    const response = await axiosInstance.get("/accounts");

    return response.data.response;
  } catch (error) {
    console.log(error);
    throw new Error("Get all accounts failed");
  }
};
