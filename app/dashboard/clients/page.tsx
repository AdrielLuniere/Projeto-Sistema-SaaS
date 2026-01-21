import { Button } from "@/components/ui/button"
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle 
} from "@/components/ui/card"
import { Plus } from "lucide-react"
import Link from "next/link"
import { getClients } from "@/actions/client"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

const ClientsPage = async () => {
  const clients = await getClients()

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Clients</h2>
        <Button asChild>
            <Link href="/dashboard/clients/new">
                <Plus className="mr-2 h-4 w-4" /> Add Client
            </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle>All Clients</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Document</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {clients.length === 0 && (
                         <TableRow>
                            <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                                No clients found.
                            </TableCell>
                         </TableRow>
                    )}
                    {clients.map((client) => (
                        <TableRow key={client.id}>
                            <TableCell className="font-medium">{client.name}</TableCell>
                            <TableCell>{client.document}</TableCell>
                            <TableCell>{client.email || "-"}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href={`/dashboard/clients/${client.id}`}>Edit</Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default ClientsPage
