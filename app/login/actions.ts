"use server";

import { signIn } from "@/auth";
import { LoginSchema } from "./_types/login";

export const loginAction = async (
  prevState: { message: string },
  formData: FormData,
) => {
  const validationResult = await LoginSchema.safeParseAsync({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!validationResult.success) {
    return {
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  await signIn("credentials", formData);

  return { message: "Login successfully" };
};
