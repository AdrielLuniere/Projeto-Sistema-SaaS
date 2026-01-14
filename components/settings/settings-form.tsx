"use client"

import { useState, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { updateSettings } from "@/actions/tenant"
import { useRouter } from "next/navigation"

interface SettingsFormProps {
    initialData: {
        name: string
        brandColor: string | null
    }
}

export const SettingsForm = ({ initialData }: SettingsFormProps) => {
    const [name, setName] = useState(initialData.name)
    const [brandColor, setBrandColor] = useState(initialData.brandColor || "#000000")
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        startTransition(() => {
            updateSettings({ name, brandColor })
                .then(() => {
                    router.refresh()
                })
        })
    }

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label>Company Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} disabled={isPending} />
            </div>
            <div className="space-y-2">
                <Label>Brand Color (Hex)</Label>
                <div className="flex items-center gap-2">
                     <Input 
                        type="color" 
                        value={brandColor} 
                        onChange={(e) => setBrandColor(e.target.value)} 
                        className="w-12 h-12 p-1 px-1"
                        disabled={isPending}
                    />
                     <Input 
                        value={brandColor} 
                        onChange={(e) => setBrandColor(e.target.value)} 
                        disabled={isPending}
                    />
                </div>
            </div>
            <Button type="submit" disabled={isPending}>
                Save Changes
            </Button>
        </form>
    )
}
