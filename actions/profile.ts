"use server"

import * as z from "zod"
import { db } from "@/lib/db"
import { auth } from "@/auth"
import { ProfileSchema, PasswordSchema } from "@/schemas/profile"
import bcrypt from "bcryptjs"
import { signOut } from "@/auth"

export const updateProfile = async (values: z.infer<typeof ProfileSchema>) => {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    const validatedFields = ProfileSchema.safeParse(values)
    if (!validatedFields.success) return { error: "Invalid fields" }

    try {
        await db.user.update({
            where: { id: session.user.id },
            data: {
                name: validatedFields.data.name,
                image: validatedFields.data.image
            }
        })
        return { success: "Profile updated!" }
    } catch {
        return { error: "Failed to update profile" }
    }
}

export const changePassword = async (values: z.infer<typeof PasswordSchema>) => {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    const validatedFields = PasswordSchema.safeParse(values)
    if (!validatedFields.success) return { error: "Invalid fields" }

    const { currentPassword, newPassword } = validatedFields.data

    const user = await db.user.findUnique({ where: { id: session.user.id } })
    if (!user || !user.password) return { error: "User not found" }

    const passwordsMatch = await bcrypt.compare(currentPassword, user.password)
    if (!passwordsMatch) return { error: "Incorrect current password" }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    try {
        await db.user.update({
            where: { id: session.user.id },
            data: {
                password: hashedPassword
            }
        })
        return { success: "Password updated!" }
    } catch {
        return { error: "Failed to update password" }
    }
}

export const deleteAccount = async () => {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    // DANGER: In a real app, complex deletion logic (cascading vs soft delete) is needed.
    // For this SaaS boilerplate, we will delete the User. 
    // If they are the only Admin of a Tenant, we might leave the Tenant orphaned or delete it too.
    // Here we delete the USER only.

    try {
        await db.user.delete({
            where: { id: session.user.id }
        })
        
        // signOut can't be called effectively in server action without redirect, 
        // but the client should handle redirect after success.
        return { success: "Account deleted" }
    } catch (e) {
        console.error(e)
        return { error: "Failed to delete account" }
    }
}
