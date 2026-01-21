"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ProfileSchema } from "@/schemas/profile"
import { updateProfile } from "@/actions/profile"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useRouter } from "next/navigation"

interface ProfileFormProps {
    user: {
        name: string
        email: string
        image: string | null
    }
}

export const ProfileForm = ({ user }: ProfileFormProps) => {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const [preview, setPreview] = useState(user.image || "")

    const form = useForm<z.infer<typeof ProfileSchema>>({
        resolver: zodResolver(ProfileSchema),
        defaultValues: {
            name: user.name,
            email: user.email,
            image: user.image || ""
        }
    })

    const onSubmit = (values: z.infer<typeof ProfileSchema>) => {
        startTransition(() => {
            updateProfile(values).then(() => router.refresh())
        })
    }

    // Mock Image Upload (In logic would be: Upload to S3/Blob -> Get URL -> Set Form)
    // Here we just use a text input or simulate
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Check file size (limit to 1MB for Base64 safety)
            if (file.size > 1024 * 1024) {
                alert("File is too large (Max 1MB)")
                return
            }

            const reader = new FileReader()
            reader.onloadend = () => {
                const base64String = reader.result as string
                setPreview(base64String)
                form.setValue("image", base64String)
            }
            reader.readAsDataURL(file)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={preview} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-2">
                        <Label>Profile Picture</Label>
                        <Input 
                            type="file" 
                            accept="image/*"
                            onChange={handleImageChange}
                            disabled={isPending}
                            className="max-w-[250px]"
                        />
                        <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 5MB.</p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={true} className="bg-muted" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" disabled={isPending}>Save Profile</Button>
            </form>
        </Form>
    )
}
