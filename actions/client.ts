"use server"

import * as z from "zod"
import { ClientSchema } from "@/schemas/client"
import { db } from "@/lib/db"
import { auth } from "@/auth"

export const createClient = async (values: z.infer<typeof ClientSchema>) => {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  // Get user to find Tenant ID
  const user = await db.user.findUnique({
    where: { id: session.user.id }
  })

  if (!user?.tenantId) {
    return { error: "Tenant not found" }
  }

  const validatedFields = ClientSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }
  }

  const { name, document, email, phone, address } = validatedFields.data

  try {
    await db.client.create({
      data: {
        name,
        document,
        email,
        phone,
        address,
        tenantId: user.tenantId
      }
    })

    return { success: "Client created!" }
  } catch (error) {
    console.error(error) 
    // Check for unique constraint (tenantId + document)
    return { error: "Something went wrong! Check if client already exists." }
  }
}

export const getClients = async () => {
    const session = await auth()
  
    if (!session?.user?.id) {
      return []
    }
  
    const user = await db.user.findUnique({
      where: { id: session.user.id }
    })
  
    if (!user?.tenantId) {
      return []
    }

    return await db.client.findMany({
        where: { tenantId: user.tenantId },
        orderBy: { createdAt: "desc" }
    })
}

export const getClient = async (id: string) => {
    const session = await auth()
    if (!session?.user?.id) return null

    const user = await db.user.findUnique({
        where: { id: session.user.id }
    })
    
    if (!user?.tenantId) return null

    return await db.client.findFirst({
        where: { 
            id,
            tenantId: user.tenantId 
        }
    })
}

export const updateClient = async (id: string, values: z.infer<typeof ClientSchema>) => {
    const session = await auth()
    
    if (!session?.user?.id) {
        return { error: "Unauthorized" }
    }
  
    // Get user to find Tenant ID (Security: ensure user owns the client)
    const user = await db.user.findUnique({
      where: { id: session.user.id }
    })
  
    if (!user?.tenantId) return { error: "Tenant not found" }
  
    const validatedFields = ClientSchema.safeParse(values)
  
    if (!validatedFields.success) {
      return { error: "Invalid fields!" }
    }
  
    // Verify client belongs to tenant
    const existingClient = await db.client.findUnique({
        where: { id }
    })

    if (!existingClient || existingClient.tenantId !== user.tenantId) {
        return { error: "Client not found or unauthorized" }
    }
  
    const { name, document, email, phone, address } = validatedFields.data
  
    try {
      await db.client.update({
        where: { id },
        data: {
          name,
          document,
          email,
          phone,
          address,
        }
      })
  
      return { success: "Client updated!" }
    } catch (error) {
      console.error(error) 
      return { error: "Failed to update client." }
    }
}
