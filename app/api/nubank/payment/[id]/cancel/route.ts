import { NextRequest, NextResponse } from "next/server"
import { NuBankService } from "@/services/nubank"

// Example Endpoint: POST /api/nubank/payment/[id]/cancel
export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id
        
        const token = process.env.NUBANK_SANDBOX_TOKEN || "test_token"
        const nubank = new NuBankService(token, true)
        
        const result = await nubank.cancelPayment(id)
        
        return NextResponse.json(result)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
