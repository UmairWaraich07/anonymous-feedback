import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, { message: "Username must be at least 2 characters" })
  .max(20, { message: "Username must no longer than 20 characters" })
  .trim()
  .regex(
    /^[a-zA-Z0-9_.]{1,20}$/,
    "Username cannot contain symbols, dashes, special characters, or emojis."
  );

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z
    .string()
    .email()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email"),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});
