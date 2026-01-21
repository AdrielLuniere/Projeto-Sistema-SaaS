"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useTransition } from "react"
import { ClientSchema } from "@/schemas/client"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { createClient, updateClient } from "@/actions/client"
import { useRouter } from "next/navigation"
// ... imports

interface ClientFormProps {
    initialData?: {
        id: string
        name: string
        document: string
        email: string | null
        phone: string | null
        address: string | null
    }
}

export const ClientForm = ({ initialData }: ClientFormProps) => {
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<z.infer<typeof ClientSchema>>({
    resolver: zodResolver(ClientSchema),
    defaultValues: {
      name: initialData?.name || "",
      document: initialData?.document || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      address: initialData?.address || "",
    },
  })

  const onSubmit = (values: z.infer<typeof ClientSchema>) => {
    setError("")
    setSuccess("")

    startTransition(() => {
        const action = initialData 
            ? updateClient(initialData.id, values)
            : createClient(values)

      action
        .then((data) => {
          if (data.error) {
            setError(data.error)
          }
          if (data.success) {
            setSuccess(data.success)
            router.push("/dashboard/clients")
            router.refresh()
          }
        })
    })
  }

  return (
    <div className="max-w-2xl mx-auto border p-6 rounded-md bg-card">
      <h2 className="text-xl font-semibold mb-4">Client Details</h2>
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Client Name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="document"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document (CPF/CNPJ)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="000.000.000-00"
                    />
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
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Optional"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Optional"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Full Address"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {error && (
            <div className="bg-destructive/15 p-3 rounded-md text-sm text-destructive">
               {error}
            </div>
          )}
          
          <Button
            disabled={isPending}
            type="submit"
            className="w-full md:w-auto"
          >
            {initialData ? "Save Changes" : "Create Client"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
