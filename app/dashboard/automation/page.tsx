import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/db"
import { auth } from "@/auth"
import { Badge } from "@/components/ui/badge"
import { Play } from "lucide-react"
import { redirect } from "next/navigation"

async function getRecentNotifications(tenantId: string) {
    return await db.notification.findMany({
        where: { boleto: { tenantId } },
        include: { boleto: { include: { client: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10
    })
}

const AutomationPage = async () => {
  const session = await auth()
  
  if (!session?.user?.id) return redirect("/login")

  const user = await db.user.findUnique({ where: { id: session.user.id } })
  if (!user?.tenantId) return redirect("/login")

  const notifications = await getRecentNotifications(user.tenantId)

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Automation System</h2>
        <div className="flex items-center space-x-2">
          {/* In a real app, this would trigger the API route via server action or client fetch */}
          <form action="/api/cron/check-boletos" method="POST">
             <Button type="submit">
                <Play className="mr-2 h-4 w-4" /> Run Manual Check
             </Button>
          </form>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest automated notifications sent by the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {notifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No automated actions recorded yet.</p>
              ) : (
                  notifications.map(notif => (
                      <div key={notif.id} className="flex items-center">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {notif.type} Notification
                          </p>
                          <p className="text-sm text-muted-foreground">
                            to {notif.boleto.client.name} (R$ {notif.boleto.amount})
                          </p>
                        </div>
                        <div className="ml-auto font-medium">
                            <Badge variant={notif.status === 'SENT' ? "secondary" : "destructive"}>
                                {notif.status}
                            </Badge>
                        </div>
                      </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
             <CardHeader>
                <CardTitle>System Status</CardTitle>
                 <CardDescription>
                    Current configuration of background jobs.
                </CardDescription>
             </CardHeader>
             <CardContent className="space-y-4">
                 <div className="flex items-center justify-between border-b pb-2">
                     <span className="text-sm font-medium">Cron Schedule</span>
                     <Badge>Daily @ 09:00 AM</Badge>
                 </div>
                 <div className="flex items-center justify-between border-b pb-2">
                     <span className="text-sm font-medium">Channels</span>
                     <div className="flex gap-1">
                        <Badge variant="outline">Email</Badge>
                        <Badge variant="outline">WhatsApp</Badge>
                     </div>
                 </div>
                 <div className="flex items-center justify-between border-b pb-2">
                     <span className="text-sm font-medium">Last Run</span>
                     <span className="text-sm text-muted-foreground">Check Logs</span>
                 </div>
             </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AutomationPage
