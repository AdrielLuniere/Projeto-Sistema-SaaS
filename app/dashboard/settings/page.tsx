import { Button } from "@/components/ui/button"
import { getSettings } from "@/actions/tenant"
import { SettingsForm } from "@/components/settings/settings-form"
import { ProfileForm } from "@/components/settings/profile-form"
import { PasswordForm } from "@/components/settings/password-form"
import { AccountForm } from "@/components/settings/account-form"
import { PaymentForm } from "@/components/settings/payment-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { auth } from "@/auth"
import { db } from "@/lib/db"

const SettingsPage = async () => {
    // Fetch Tenant settings
    const settings = await getSettings()
    
    // Fetch User settings for Profile Tab
    const session = await auth()
    
    if (!session?.user?.id) return <div>Unauthorized</div>

    const user = await db.user.findUnique({
        where: { id: session.user.id }
    })

    if (!settings || !user) return <div>Tenant or User not found</div>

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>

      <Tabs defaultValue="company" className="space-y-4">
          <TabsList>
            <TabsTrigger value="company">Platform Branding</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="profile">My Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="company" className="space-y-4">
               <div className="border p-6 rounded-md bg-card max-w-xl">
                  <h3 className="text-lg font-medium mb-4">Company Details & Branding</h3>
                  <SettingsForm initialData={settings} />
               </div>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
               <div className="border p-6 rounded-md bg-card max-w-xl">
                  <h3 className="text-lg font-medium mb-4">Payment Gateways</h3>
                  <PaymentForm initialData={settings} />
               </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
               <div className="border p-6 rounded-md bg-card max-w-xl">
                  <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                  <ProfileForm user={user} />
               </div>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
               <div className="border p-6 rounded-md bg-card max-w-xl">
                  <h3 className="text-lg font-medium mb-4">Change Password</h3>
                  <PasswordForm />
               </div>
               
               <div className="max-w-xl">
                   <AccountForm />
               </div>
          </TabsContent>
      </Tabs>

    </div>
  )
}

export default SettingsPage
