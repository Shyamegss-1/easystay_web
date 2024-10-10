import { z } from "zod";

export const UsernameValidation = z
  .string()
  .min(2, { message: "username must be atleast 2 characters" })
  .max(20, { message: "Username must be no more than 20 characters" })
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "Username must not contain special characters",
  });

export const EmailValidation = z
  .string()
  .email({ message: "Invalid email address" });

export const signupSchema = z.object({
  username: UsernameValidation,
  email: EmailValidation,
  password: z.string().min(8, "Password must be at least 8 characters"),

});
