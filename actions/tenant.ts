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

const PaymentSettingsSchema = z.object({
    nubankToken: z.string().optional(),
    nubankKey: z.string().optional(),
    nubankAccessToken: z.string().optional(),
    nubankSandbox: z.boolean().default(true)
})

export const updatePaymentSettings = async (values: z.infer<typeof PaymentSettingsSchema>) => {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }
  
    const user = await db.user.findUnique({ where: { id: session.user.id } })
    if (!user?.tenantId) return { error: "Unauthorized" }

    try {
        await db.tenant.update({
            where: { id: user.tenantId },
            data: {
                nubankToken: values.nubankToken,
                nubankKey: values.nubankKey,
                nubankAccessToken: values.nubankAccessToken,
                nubankSandbox: values.nubankSandbox
            }
        })
        return { success: "Payment settings updated!" }
    } catch (e) {
        return { error: "Failed to update payment settings" }
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
