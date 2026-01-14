import { ClientForm } from "@/components/clients/client-form"

const NewClientPage = () => {
    return (
        <div className="flex-1 space-y-4">
             <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">New Client</h2>
             </div>
             <ClientForm />
        </div>
    )
}

export default NewClientPage
