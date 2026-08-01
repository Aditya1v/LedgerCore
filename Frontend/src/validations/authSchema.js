import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),

  password: z
    .string()
    .min(1, "Password is required.")
    .min(7, "Password must be at least 7 characters."),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .min(3, "Name must be at least 3 characters."),

  email: z
    .string()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),

  password: z
    .string()
    .min(1, "Password is required.")
    .min(7, "Password must be at least 7 characters."),
});