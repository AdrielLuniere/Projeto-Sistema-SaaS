"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTransition } from "react"
import { updatePaymentSettings } from "@/actions/tenant"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner" // Assuming sonner or use toast from hook

const PaymentSettingsSchema = z.object({
  nubankToken: z.string().optional(),
  nubankKey: z.string().optional(),
  nubankAccessToken: z.string().optional(),
  nubankSandbox: z.boolean().default(true)
})

interface PaymentFormProps {
    initialData: {
        nubankToken?: string | null
        nubankKey?: string | null
        nubankAccessToken?: string | null
        nubankSandbox: boolean
    }
}

export const PaymentForm = ({ initialData }: PaymentFormProps) => {
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof PaymentSettingsSchema>>({
    resolver: zodResolver(PaymentSettingsSchema),
    defaultValues: {
      nubankToken: initialData.nubankToken || "",
      nubankKey: initialData.nubankKey || "",
      nubankAccessToken: initialData.nubankAccessToken || "",
      nubankSandbox: initialData.nubankSandbox
    },
  })

  const onSubmit = (values: z.infer<typeof PaymentSettingsSchema>) => {
    startTransition(() => {
      updatePaymentSettings(values)
        .then((data) => {
            if (data.error) {
                // toast.error(data.error)
                alert(data.error)
            } else {
                // toast.success("Payment settings updated!")
                alert("Settings updated successfully!")
            }
        })
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>NuBank / SpinPay Configuration</CardTitle>
        <CardDescription>
          Configure your payment gateway credentials. Use Sandbox for testing.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            <FormField
              control={form.control}
              name="nubankSandbox"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Sandbox Mode</FormLabel>
                    <FormDescription>
                      Enable for testing environment. Disable for production.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nubankKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>X-Merchant-Key</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Merchant Key" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nubankToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>X-Merchant-Token</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Merchant Token" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nubankAccessToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bearer Authorization Token</FormLabel>
                  <FormDescription>Required for Pre-authorized/Recurring payments.</FormDescription>
                  <FormControl>
                    <Input placeholder="Your Access Token" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isPending} type="submit">
              Save Configuration
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
