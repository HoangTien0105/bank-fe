"use server";

import { createCustomer } from "@/api/customer";
import { CreateCustomerSchema } from "./_types/create-customer";

export const createCustomerAction = async (
  prevState: { success: boolean; message: string },
  formData: FormData,
) => {
  try {
    console.log("Form data:", formData);
    const payload = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      citizenId: formData.get("citizenId") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
      customerType: formData.get("customerType") as string,
    };
    const validationResult = await CreateCustomerSchema.safeParseAsync(payload);

    if (!validationResult.success) {
      return {
        success: false,
        message: "Validation error",
      };
    }

    await createCustomer(payload);

    return { success: true, message: "Create customer successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something wrong happened" };
  }
};
