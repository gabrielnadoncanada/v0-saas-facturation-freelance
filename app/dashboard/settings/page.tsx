import { ProfileForm } from "@/components/features/settings/profile-form"
import { getUserProfile } from "@/app/actions/settings"
import { redirect } from "next/navigation"

export default async function SettingsPage() {
  const result = await getUserProfile()

  if (!result.success) {
    redirect("/login")
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">Gérez vos informations personnelles et professionnelles</p>
      </div>

      <div className="grid gap-6">
        <ProfileForm profile={result.data} />
      </div>
    </div>
  )
}
