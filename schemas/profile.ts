import * as z from "zod"

export const ProfileSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email().optional(), // Read-only mostly
  image: z.string().optional(),
})

export const PasswordSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required" }),
  newPassword: z.string().min(6, { message: "Minimum 6 characters required" }),
  confirmPassword: z.string().min(1, { message: "Confirmation is required" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})
