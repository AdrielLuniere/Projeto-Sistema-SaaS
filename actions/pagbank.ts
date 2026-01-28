"use server"

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { PagBankService } from "@/services/pagbank"
import { BoletoSchema } from "@/schemas/boleto"
import * as z from "zod"

// This is an example Action showing how to integrate the Service Layer
export const createPagBankBoleto = async (values: z.infer<typeof BoletoSchema>) => {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    const user = await db.user.findUnique({
        where: { id: session.user.id },
        include: { tenant: true }
    })

    if (!user?.tenantId) return { error: "Tenant not found" }
    
    // Check if Tenant has credentials
    const { pagbankToken, pagbankSandbox } = user.tenant
    
    if (!pagbankToken) {
        return { error: "PagBank Token not configured for this Tenant." }
    }

    const pagbank = new PagBankService(pagbankToken, pagbankSandbox)

    // Fetch Client Data for the Payload
    const client = await db.client.findUnique({
        where: { id: values.clientId } // Ensure BoletoSchema has clientId
    })

    if (!client || !client.document) {
        return { error: "Client invalid or missing Document (CPF/CNPJ)" }
    }

    // Construct Payload
    // Note: Amount must be in cents for PagBank
    const payload = {
        reference_id: `BOLETO-${Date.now()}`, // Temporary ID
        description: values.description || "Boleto SaaS",
        amount: {
            value: Math.round(values.amount * 100), // R$ 10,00 -> 1000 cents
            currency: "BRL" as const
        },
        payment_method: {
            type: "BOLETO" as const,
            boleto: {
                due_date: values.dueDate.toISOString().split('T')[0], // YYYY-MM-DD
                instruction_lines: {
                    line_1: "Pagável em qualquer banco até o vencimento",
                    line_2: "Não receber após o vencimento"
                },
                holder: {
                    name: client.name,
                    tax_id: client.document.replace(/\D/g, ''), // Remove formatting
                    email: client.email || "email@teste.com",
                    address: {
                        country: "BRA" as const,
                        region_code: "SP", // Simplification: In real app, extract from address
                        city: "Sao Paulo",
                        postal_code: "01452002",
                        street: "Av Faria Lima",
                        number: "1000",
                        locality: "Pinheiros"
                    }
                }
            }
        }
    }

    try {
        console.log("Sending to PagBank:", payload)
        const response = await pagbank.createBoleto(payload)
        
        // Response contains the boleto details (barcode, link, etc)
        // Adjust these fields based on actual PagBank Response structure
        const charge = response.charges ? response.charges[0] : response;
        const boletoData = charge.payment_method.boleto;
        
        // Save to Database
        await db.boleto.create({
            data: {
                amount: values.amount,
                dueDate: values.dueDate,
                description: values.description,
                status: "PENDING",
                
                // New Fields
                chargeId: charge.id,
                paymentLink: charge.links.find((l: any) => l.rel === "pay")?.href || boletoData.formatted_barcode, // Example
                barcode: boletoData.barcode,
                digitableLine: boletoData.formatted_barcode,
                pdfUrl: charge.links.find((l: any) => l.media === "application/pdf")?.href,

                tenantId: user.tenantId,
                clientId: values.clientId
            }
        })

        return { success: "Boleto PagBank Created!" }

    } catch (error: any) {
        console.error("Action Error:", error.message)
        return { error: error.message || "Failed to create with PagBank" }
    }
}
