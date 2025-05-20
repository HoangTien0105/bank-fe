import { z } from "zod/v4";

export const LoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type TLoginSchema = z.infer<typeof LoginSchema>;
