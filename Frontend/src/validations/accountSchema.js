import { z } from "zod";

export const createAccountSchema = z.object({
  name: z
    .string()
    .min(3, "Account name must be at least 3 characters"),

  type: z.enum(["SAVINGS", "CURRENT"], {
    required_error: "Please select an account type",
  }),
});