import { db } from "@/lib/db"
import { sendEmail } from "@/lib/mail"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    // Use an API Key or Secret to protect this route in production
    // const authHeader = req.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) ...

    try {
        const today = new Date()
        const threeDaysFromNow = new Date()
        threeDaysFromNow.setDate(today.getDate() + 3)

        // Find boletos due in 3 days that are PENDING and haven't been notified recently
        // Simple logic for demo
        const boletosDueSoon = await db.boleto.findMany({
            where: {
                status: "PENDING",
                dueDate: {
                    lte: threeDaysFromNow,
                    gte: today
                }
            },
            include: {
                client: true
            }
        })

        let notificationsSent = 0

        for (const boleto of boletosDueSoon) {
            if (boleto.client.email) {
                await sendEmail(
                    boleto.client.email, 
                    "Upcoming Boleto Due", 
                    `Hello ${boleto.client.name}, your boleto of R$ ${boleto.amount} expires on ${boleto.dueDate.toLocaleDateString()}.`
                )
                
                // Log notification
                await db.notification.create({
                    data: {
                        boletoId: boleto.id,
                        type: "EMAIL",
                        status: "SENT",
                        sentAt: new Date()
                    }
                })
                notificationsSent++
            }
        }

        return NextResponse.json({ 
            success: true, 
            processed: boletosDueSoon.length, 
            sent: notificationsSent 
        })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
