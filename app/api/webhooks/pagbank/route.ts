import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// This is a simplified webhook handler.
// In production, you MUST validate the PagBank signature or use a secret token.

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        
        // Log the webhook for debugger
        console.log("PagBank Webhook received:", JSON.stringify(body, null, 2));

        const { id, reference_id, status, charges } = body;

        // PagBank event structure varies slightly depending on version, 
        // usually it sends the charge object.

        // Example: if body.charges exists
        if (charges && charges.length > 0) {
           const charge = charges[0];
           const chargeStatus = charge.status; // PAID, CANCELED, WAITING
           const chargeId = charge.id;

           // Find Boleto by Charge ID or Reference ID (our boleto ID)
           // ideally use reference_id as it maps to our internal ID
           const boleto = await db.boleto.findFirst({
               where: {
                   OR: [
                       { chargeId: chargeId },
                       { id: reference_id } // Assuming reference_id was set to boleto.id
                   ]
               }
           });

           if (boleto) {
               let newStatus = boleto.status;

               if (chargeStatus === "PAID") newStatus = "PAID";
               if (chargeStatus === "CANCELED") newStatus = "CANCELLED";
               if (chargeStatus === "DECLINED") newStatus = "FAILED";

               if (newStatus !== boleto.status) {
                   await db.boleto.update({
                       where: { id: boleto.id },
                       data: { status: newStatus }
                   });

                   // Log success
                   await db.log.create({
                       data: {
                           action: "WEBHOOK_UPDATE",
                           details: `Status updated to ${newStatus} via Webhook`,
                           boletoId: boleto.id
                       }
                   });
               }
           }
        }

        return NextResponse.json({ received: true }, { status: 200 });

    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
