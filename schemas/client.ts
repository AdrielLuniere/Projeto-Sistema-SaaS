import * as z from "zod"

export const ClientSchema = z.object({
  name: z.string().min(2, {
    message: "Name is required",
  }),
  document: z.string().min(11, {
    message: "CPF/CNPJ is required",
  }),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
})
