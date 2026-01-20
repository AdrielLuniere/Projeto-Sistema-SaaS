"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { deleteAccount } from "@/actions/profile"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { Label } from "@/components/ui/label"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export const AccountForm = () => {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleDelete = () => {
        startTransition(() => {
            // Server action deletes DB record
            deleteAccount().then(async (res) => {
                if (res.success) {
                    // Client side cleans up session
                    await signOut()
                }
            })
        })
    }

    return (
        <div className="space-y-4 border border-destructive/50 p-4 rounded-lg bg-destructive/5 mt-4">
             <div>
                <Label className="text-destructive font-bold text-lg">Danger Zone</Label>
                <p className="text-sm text-muted-foreground">Once you delete your account, there is no going back. Please be certain.</p>
             </div>
             
             <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={isPending}>Delete Account</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={handleDelete}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
             </AlertDialog>
        </div>
    )
}
