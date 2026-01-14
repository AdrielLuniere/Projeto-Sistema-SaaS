import { BoletoForm } from "@/components/boletos/boleto-form"
import { getClients } from "@/actions/client"

const NewBoletoPage = async () => {
    const clients = await getClients()

    return (
        <div className="flex-1 space-y-4 h-[calc(100vh-100px)]">
             <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Create Boleto</h2>
             </div>
             <BoletoForm clients={clients} />
        </div>
    )
}

export default NewBoletoPage
