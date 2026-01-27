import { NextRequest, NextResponse } from "next/server"
import { renderToStream } from "@react-pdf/renderer"
import { BoletoTemplate } from "@/components/boletos/pdf-template"
import { db } from "@/lib/db"
import { auth } from "@/auth"
import React from "react"

export async function GET(
  req: NextRequest, 
  { params }: { params: { boletoId: string } }
) {
    const boletoId = params.boletoId

    const session = await auth()
    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const { user } = session

    // Fetch Boleto with relations
    const boleto = await db.boleto.findUnique({
        where: { id: boletoId },
        include: {
            client: true,
            tenant: true
        }
    })

    if (!boleto) {
        return new NextResponse("Not Found", { status: 404 })
    }

    // Security check: ensure tenant owns this boleto
    const dbUser = await db.user.findUnique({ where: { id: user.id } })
    if (boleto.tenantId !== dbUser?.tenantId) {
         return new NextResponse("Forbidden", { status: 403 })
    }

    // Generate PDF Stream using React.createElement explicitly to avoid JSX syntax in .ts file
    const stream = await renderToStream(React.createElement(BoletoTemplate, { boleto: boleto }))
    
    // Create Response
    const chunks: Uint8Array[] = []
    for await (const chunk of stream) {
        chunks.push(chunk as Uint8Array)
    }
    const pdfBuffer = Buffer.concat(chunks)

    return new NextResponse(pdfBuffer, {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename="boleto-${boleto.ourNumber || 'draft'}.pdf"`
        }
    })
}
