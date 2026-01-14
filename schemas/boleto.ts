import * as z from "zod"

export const BoletoSchema = z.object({
  clientId: z.string().min(1, { message: "Client is required" }),
  amount: z.coerce.number().min(0.01, { message: "Amount must be greater than 0" }),
  dueDate: z.coerce.date(),
  description: z.string().optional(),
})
