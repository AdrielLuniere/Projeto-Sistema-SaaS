"use server"

import * as z from "zod"
import { RegisterSchema } from "@/schemas/auth"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }
  }

  const { email, password, name, companyName, document } = validatedFields.data
  const hashedPassword = await bcrypt.hash(password, 10)

  const existingUser = await db.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return { error: "Email already in use!" }
  }

  // Create Tenant and User Transaction
  try {
    await db.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name: companyName,
          document: document,
          email: email, 
        }
      })

      await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          tenantId: tenant.id,
          role: "ADMIN"
        }
      })
    })

    return { success: "Account created!" }
  } catch (error) {
    console.error(error)
    return { error: "Something went wrong!" }
  }
}
