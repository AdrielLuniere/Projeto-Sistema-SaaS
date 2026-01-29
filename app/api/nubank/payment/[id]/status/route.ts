import { NextRequest, NextResponse } from "next/server"
import { NuBankService } from "@/services/nubank"

// Example Endpoint: GET /api/nubank/payment/[id]/status
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id
        
        const token = process.env.NUBANK_SANDBOX_TOKEN || "test_token"
        const nubank = new NuBankService(token, true)
        
        const status = await nubank.getPaymentStatus(id)
        
        return NextResponse.json(status)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
