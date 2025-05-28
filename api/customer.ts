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

export const createCustomer = async (payload: any) => {
  try {
    const response = await axiosInstance.post("/customers", payload);

    return response.data.response;
  } catch (error) {
    console.log(error);
    throw new Error("Create customer failed");
  }
};
