import { ClientForm } from "@/components/clients/client-form"
import { getClient } from "@/actions/client"
import { redirect } from "next/navigation"

interface EditClientPageProps {
    params: {
        clientId: string
    }
}

const EditClientPage = async ({ params }: EditClientPageProps) => {
    // Await params if necessary in newer Next.js versions (though params is sync in this version usually, but harmless to treat as is)
    // Actually in Next 15+ it might be sync/async depending on config, but standard is props access.
    
    const client = await getClient(params.clientId)

    if (!client) {
        return redirect("/dashboard/clients")
    }

    return (
        <div className="flex-1 space-y-4 pt-4">
             <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Edit Client</h2>
             </div>
             <ClientForm initialData={client} />
        </div>
    )
}

export default EditClientPage
