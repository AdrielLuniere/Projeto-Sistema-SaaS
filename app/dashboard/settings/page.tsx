import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getSettings, updateSettings } from "@/actions/tenant"
import { SettingsForm } from "@/components/settings/settings-form"

const SettingsPage = async () => {
  const settings = await getSettings()

  if (!settings) return <div>Tenant not found</div>

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>
      <div className="border p-6 rounded-md bg-card max-w-xl">
          <SettingsForm initialData={settings} />
      </div>
    </div>
  )
}

export default SettingsPage
