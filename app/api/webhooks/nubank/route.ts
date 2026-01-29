import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        
        console.log("NuBank Webhook:", JSON.stringify(body, null, 2));

        // SpinPay/NuBank Event Structure
        // { "type": "payment.paid", "data": { "id": "...", "status": "PAID" } }
        
        const { type, data } = body;

        if (!data || !data.id) {
             return NextResponse.json({ received: true }, { status: 200 });
        }

        const chargeId = data.id;

        // Find Boleto
        const boleto = await db.boleto.findFirst({
            where: { chargeId: chargeId }
        });

        if (boleto) {
            let newStatus = boleto.status;

            if (type === "payment.paid" || data.status === "PAID") newStatus = "PAID";
            if (type === "payment.failed" || data.status === "FAILED") newStatus = "FAILED";
            if (type === "payment.canceled" || data.status === "CANCELED") newStatus = "CANCELLED";

            if (newStatus !== boleto.status) {
                await db.boleto.update({
                    where: { id: boleto.id },
                    data: { status: newStatus }
                });

                await db.log.create({
                    data: {
                        action: "WEBHOOK_UPDATE",
                        details: `Status updated to ${newStatus} via NuBank Webhook`,
                        boletoId: boleto.id
                    }
                });
            }
        }

        return NextResponse.json({ received: true }, { status: 200 });

    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
