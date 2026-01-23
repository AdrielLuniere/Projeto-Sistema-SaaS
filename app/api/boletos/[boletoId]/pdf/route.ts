import { NextRequest, NextResponse } from "next/server"
import { renderToStream } from "@react-pdf/renderer"
import { BoletoTemplate } from "@/components/boletos/pdf-template"
import { db } from "@/lib/db"
import { auth } from "@/auth"

export async function GET(
  req: NextRequest, 
  { params }: { params: { boletoId: string } }
) {
    // Note: in NextJS 15+ "params" is a Promise, in 14 it is object.
    // Assuming standard Next 14 behavior based on previous files, but we can await it if needed or treat as obj.
    // If we face runtime issues, we will add await.
    // For safety with types in route handlers:
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

    // Generate PDF Stream
    const stream = await renderToStream(<BoletoTemplate boleto={boleto} />)
    
    // Create Response
    // We need to convert the NodeJS ReadableStream to a Web ReadableStream or Buffer
    // renderToStream returns a NodeJS.ReadableStream. 
    // NextResponse expects a body that can be Blob, Buffer, or Web Stream.
    
    // Helper to convert stream to buffer
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
