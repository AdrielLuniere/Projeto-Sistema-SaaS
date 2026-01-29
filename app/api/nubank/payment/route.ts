import { NextRequest, NextResponse } from "next/server"
import { NuBankService } from "@/services/nubank"

// Example Endpoint: POST /api/nubank/create-payment
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        
        // In a real scenario, you'd fetch the tenant token from DB based on API Key or Auth
        // For demo, we assume a hardcoded or env token for "Default Tenant"
        const token = process.env.NUBANK_SANDBOX_TOKEN || "test_token"
        
        const nubank = new NuBankService(token, true)
        
        const result = await nubank.createPayment(body)
        
        return NextResponse.json(result)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
