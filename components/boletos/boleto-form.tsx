"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useTransition, useEffect } from "react"
import { BoletoSchema } from "@/schemas/boleto"
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
import { createNuBankBoleto } from "@/actions/nubank"
import { useRouter } from "next/navigation"
import { Client } from "@prisma/client"
import { BoletoPdf } from "./boleto-pdf"
import dynamic from "next/dynamic"

// Import PDFViewer dynamically ensuring it only runs on client
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <div className="h-[500px] w-full bg-slate-100 flex items-center justify-center">Loading Preview...</div>,
  }
)

interface BoletoFormProps {
    clients: Client[]
}

export const BoletoForm = ({ clients }: BoletoFormProps) => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<z.infer<typeof BoletoSchema>>({
    resolver: zodResolver(BoletoSchema) as any,
    defaultValues: {
      amount: 0,
       description: "",
       clientId: ""
    },
  })

  // Watch values for live preview
  const watchValues = form.watch()
  const selectedClient = clients.find(c => c.id === watchValues.clientId)

  const onSubmit = (values: z.infer<typeof BoletoSchema>) => {
    startTransition(() => {
      createNuBankBoleto(values) // Switched to NuBank Action
        .then((data) => {
             if (data.success) {
                 router.push("/dashboard/boletos")
             } else {
                 // ideally handle error here (e.g. toast)
                 alert("Failed: " + data.error)
             }
        })
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        {/* Left: Form */}
        <div className="bg-card p-6 rounded-md border">
            <h3 className="text-lg font-semibold mb-4">Details</h3>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="clientId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Client</FormLabel>
                                <FormControl>
                                    <select 
                                        {...field}
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="">Select a Client</option>
                                        {clients.map(client => (
                                            <option key={client.id} value={client.id}>{client.name} - {client.document}</option>
                                        ))}
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Amount (R$)</FormLabel>
                                <FormControl>
                                    <Input 
                                        type="number" 
                                        step="0.01"
                                        placeholder="0.00"
                                        {...field} 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Due Date</FormLabel>
                                <FormControl>
                                    <Input 
                                        type="date" 
                                        {...field} 
                                        value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                                        onChange={(e) => field.onChange(new Date(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="Service payment..."
                                        {...field} 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button disabled={isPending} type="submit" className="w-full">
                        Generate Boleto
                    </Button>
                </form>
            </Form>
        </div>

        {/* Right: Preview */}
        <div className="bg-slate-50 border rounded-md p-4 flex flex-col">
            <h3 className="text-lg font-semibold mb-4 text-slate-800">Live Preview</h3>
            <div className="flex-1 min-h-[500px] border shadow-sm bg-white">
                 <PDFViewer width="100%" height="100%" className="min-h-[500px]">
                     <BoletoPdf 
                        data={{
                            amount: Number(watchValues.amount) || 0,
                            dueDate: watchValues.dueDate || new Date(),
                            clientName: selectedClient?.name || "Client Name",
                            description: watchValues.description
                        }}
                     />
                 </PDFViewer>
            </div>
        </div>
    </div>
  )
}
