"use server"

import * as z from "zod"
import { BoletoSchema } from "@/schemas/boleto"
import { db } from "@/lib/db"
import { auth } from "@/auth"

export const createBoleto = async (values: z.infer<typeof BoletoSchema>) => {
  const session = await auth()
  
  if (!session?.user?.id) return { error: "Unauthorized" }

  const user = await db.user.findUnique({
    where: { id: session.user.id }
  })

  // Basic Boleto logic placeholder
  // In a real app, we would call a Bank API or generate the Barcode here.
  
  try {
     await db.boleto.create({
        data: {
            amount: values.amount,
            dueDate: values.dueDate,
            description: values.description,
            clientId: values.clientId,
            tenantId: user!.tenantId,
            status: "PENDING",
            ourNumber: Math.floor(Math.random() * 1000000).toString(), // Mock
        }
     })
     return { success: "Boleto created!" }
  } catch (err) {
      console.error(err)
      return { error: "Failed to create boleto" }
  }
}

export const getBoletos = async () => {
    const session = await auth()
    if (!session?.user?.id) return []

    const user = await db.user.findUnique({ where: { id: session.user.id } })
    if (!user?.tenantId) return []

    return await db.boleto.findMany({
        where: { tenantId: user.tenantId },
        include: { client: true },
        orderBy: { createdAt: "desc" }
    })
}
