const { z } = require("zod");

const createAccountSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Account name is required")
    .max(50, "Account name cannot exceed 50 characters"),

  type: z.enum(["SAVINGS", "CURRENT", "CREDIT", "CASH"]),
});

module.exports = {
  createAccountSchema,
};