import axiosInstance from "@/config/axios";

export const getAllCustomers = async () => {
  try {
    const response = await axiosInstance.get("/customers");

    return response.data.response;
  } catch (error) {
    console.log(error);
    throw new Error("Get all customers failed");
  }
};
