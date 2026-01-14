import { Button } from "@/components/ui/button"
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle 
} from "@/components/ui/card"
import { Plus } from "lucide-react"
import Link from "next/link"
import { getBoletos } from "@/actions/boleto"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const BoletosPage = async () => {
  const boletos = await getBoletos()

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Boletos</h2>
        <Button asChild>
            <Link href="/dashboard/boletos/new">
                <Plus className="mr-2 h-4 w-4" /> New Boleto
            </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle>Recent Boletos</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {boletos.length === 0 && (
                         <TableRow>
                            <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                No boletos found.
                            </TableCell>
                         </TableRow>
                    )}
                    {boletos.map((boleto) => (
                        <TableRow key={boleto.id}>
                            <TableCell className="font-medium">{boleto.client.name}</TableCell>
                            <TableCell>{boleto.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                            <TableCell>{boleto.dueDate.toLocaleDateString('pt-BR')}</TableCell>
                            <TableCell>
                                <Badge variant={boleto.status === "PENDING" ? "secondary" : "default"}>
                                    {boleto.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="sm">PDF</Button>
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

export default BoletosPage
