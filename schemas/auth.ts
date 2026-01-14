import * as z from "zod"

export const RegisterSchema = z.object({
  companyName: z.string().min(2, {
    message: "Company name is required",
  }),
  document: z.string().min(11, {
    message: "Valid Document (CPF/CNPJ) is required",
  }),
  name: z.string().min(2, {
    message: "Name is required",
  }),
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
})

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
})
