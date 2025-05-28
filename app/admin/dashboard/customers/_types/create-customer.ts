import { z } from "zod";

export const CreateCustomerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  citizenId: z.string(),
  phone: z.string(),
  address: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
  customerType: z.string(),
});

export type TCreateCustomerSchema = z.infer<typeof CreateCustomerSchema>;
