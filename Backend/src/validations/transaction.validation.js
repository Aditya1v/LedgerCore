const { z } = require("zod");

const createTransactionSchema = z.object({
  fromAccount: z
    .string()
    .min(1, "From account is required"),

  toAccount: z
    .string()
    .min(1, "To account is required"),

  amount: z
    .number({
      required_error: "Amount is required",
    })
    .positive("Amount must be greater than 0"),

  category: z
    .string()
    .trim()
    .min(1, "Category is required"),

  merchant: z
    .string()
    .max(100, "Merchant name is too long")
    .optional()
    .default(""),

  description: z
    .string()
    .max(300, "Description is too long")
    .optional()
    .default(""),

  tags: z
    .array(z.string())
    .optional()
    .default([]),

  idempotencyKey: z
    .string()
    .min(1, "Idempotency key is required"),
});

module.exports = {
  createTransactionSchema,
};