"use server"

import * as z from "zod"
import { db } from "@/lib/db"
import { auth } from "@/auth"

const SettingsSchema = z.object({
  name: z.string().min(1),
  brandColor: z.string().min(1),
  // logoUrl would be handled by upload (later)
})

export const updateSettings = async (values: z.infer<typeof SettingsSchema>) => {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }
  
    const user = await db.user.findUnique({ where: { id: session.user.id } })
    if (!user?.tenantId) return { error: "Unauthorized" }

    try {
        await db.tenant.update({
            where: { id: user.tenantId },
            data: {
                name: values.name,
                brandColor: values.brandColor
            }
        })
        return { success: "Settings updated!" }
    } catch {
        return { error: "Failed to update settings" }
    }
}

export const getSettings = async () => {
    const session = await auth()
    if (!session?.user?.id) return null
  
    const user = await db.user.findUnique({ where: { id: session.user.id } })
    if (!user?.tenantId) return null

    return await db.tenant.findUnique({
        where: { id: user.tenantId }
    })
}
