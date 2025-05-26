"use server";

import { RegisterSchema } from "./_types/register";

export const registerAction = async (
  prevState: { success: boolean; message: string },
  formData: FormData,
) => {
  try {
    console.log("Form data: ", formData);
    const validationResult = await RegisterSchema.safeParseAsync({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      citizenId: formData.get("citizenId") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    });

    if (!validationResult.success) {
      return {
        success: false,
        message: "Validation error",
      };
    }

    // Call API register
    const response = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validationResult.data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "Registration failed",
      };
    }

    return { success: true, message: "Registration successful" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something wrong happened" };
  }
};