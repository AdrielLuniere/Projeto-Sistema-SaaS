import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

const DashboardLayout = async ({
  children
}: {
  children: React.ReactNode
}) => {
  const session = await auth()
  
  // We fetch the user from DB to ensure we have the latest Profile Image (bypassing stale session cookie)
  // If session is invalid, the individual pages usually handle redirect, but we can check here too.
  const user = session?.user?.id ? await db.user.findUnique({ where: { id: session.user.id } }) : null

  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
        <Sidebar />
      </div>
      <main className="md:pl-72 h-full">
        <Header user={user} />
        <div className="p-8">
           {children}
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout
