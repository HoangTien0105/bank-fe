"use server";

import { signIn } from "@/auth";
import { LoginSchema } from "./_types/login";

export const loginAction = async (
  prevState: { success: boolean; message: string },
  formData: FormData,
) => {
  try {
    console.log("Form data: ", formData);
    const validationResult = await LoginSchema.safeParseAsync({
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    });

    if (!validationResult.success) {
      return {
        success: false,
        message: "Validation error",
      };
    }

    await signIn("credentials", {
      username: validationResult.data.username,
      password: validationResult.data.password,
      redirect: false,
    });

    return { success: true, message: "Login successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something wrong happened" };
  }
};
