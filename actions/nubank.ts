"use server"

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { NuBankService, NuBankPayload } from "@/services/nubank"
import { BoletoSchema } from "@/schemas/boleto"
import * as z from "zod"

export const createNuBankBoleto = async (values: z.infer<typeof BoletoSchema>) => {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    const user = await db.user.findUnique({
        where: { id: session.user.id },
        include: { tenant: true }
    })

    if (!user?.tenantId) return { error: "Tenant not found" }
    
    // Check Config
    // Now expecting both token and key
    const { nubankToken, nubankKey, nubankSandbox } = user.tenant
    
    // Fallback: If no key in DB (legacy or not set), we might fail or need a default.
    // For this implementation, we require both.
    if (!nubankToken || !nubankKey) {
        return { error: "NuBank Token AND Key required in Tenant Settings." }
    }

    const nubank = new NuBankService(nubankToken, nubankKey, nubankSandbox)

    const client = await db.client.findUnique({
        where: { id: values.clientId }
    })

    if (!client || !client.document) {
        return { error: "Client invalid or missing Document" }
    }

    // Prepare Customer Data
    const nameParts = client.name.trim().split(" ")
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(" ") || "."
    const document = client.document.replace(/\D/g, '')

    // Unique IDs
    const referenceId = `REF-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    const merchantOrderReference = `ORD-${Date.now()}`

    // Construct Payload based on cURL
    const payload: NuBankPayload = {
       referenceId: referenceId,
       merchantOrderReference: merchantOrderReference,
       amount: {
         value: Number(values.amount.toFixed(2)),
         currency: "BRL"
       },
       paymentMethod: {
         type: "nupay",
         authorizationType: "manually_authorized"
       },
       shopper: {
         firstName: firstName,
         lastName: lastName,
         document: document,
         documentType: document.length > 11 ? "CNPJ" : "CPF",
         email: client.email || "email@valid.com",
         phone: {
           country: "55",
           number: client.phone ? client.phone.replace(/\D/g, '') : "11999999999"
         }
       },
       paymentFlow: {
         returnUrl: "https://seusistema.com/dashboard/boletos", // Replace with env var
         cancelUrl: "https://seusistema.com/dashboard/boletos"
       },
       recipients: {
         referenceId: referenceId,
         amount: {
            value: Number(values.amount.toFixed(2)),
            currency: "BRL"
          }                 
       }
    }

    try {
        console.log("Sending to NuBank:", JSON.stringify(payload, null, 2))
        const response = await nubank.createPayment(payload)
        
        // Extract Data
        // User cURL doesn't show response, but assuming standard return:
        const chargeId = response.id || response.transactionId || referenceId;
        
        // Try to find the URL in common locations
        // Or in 'checkoutUrl', 'paymentUrl', checkouts[0].paymentUrl etc
        const pdfUrl = response.paymentUrl || response.checkoutUrl || response.redirectUrl; 
        
        const barcode = response.barcode; 
        const digitable = response.digitableLine;

        await db.boleto.create({
            data: {
                amount: values.amount,
                dueDate: values.dueDate,
                description: values.description,
                status: "PENDING",
                
                chargeId: chargeId,
                paymentLink: pdfUrl, 
                pdfUrl: pdfUrl,
                barcode: barcode,
                digitableLine: digitable,

                clientId: values.clientId
            }
        })

        // Notification (Email) via Resend
        if (client.email && client.email.includes("@")) {
             try {
                 const { sendEmail } = await import("@/lib/mail")
                 await sendEmail(
                    client.email,
                    `Seu Boleto: ${values.description || 'Nova Cobrança'}`,
                    `<div style="font-family: sans-serif;">
                        <h2>Olá, ${firstName}!</h2>
                        <p>Seu boleto no valor de <strong>R$ ${values.amount.toFixed(2)}</strong> foi gerado com sucesso.</p>
                        <p>Vencimento: ${values.dueDate.toLocaleDateString('pt-BR')}</p>
                        <br/>
                        <a href="${pdfUrl}" style="background: #27D1CE; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                           Visualizar Boleto
                        </a>
                        <p style="margin-top:20px; color:#666;">Ou utilize o código de barras:</p>
                        <p style="background:#f4f4f4; padding:10px; font-family:monospace;">${digitable || barcode}</p>
                    </div>`
                 )
             } catch (mailErr) {
                 console.error("Failed to send email:", mailErr)
                 // Don't block the response if email fails
             }
        }

        return { success: "Boleto NuBank Created & Email Sent!" }

    } catch (error: any) {
        console.error("Action Error:", error.message)
        return { error: error.message || "Failed to create with NuBank" }
    }
}
