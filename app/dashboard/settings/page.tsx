import { ProfileForm } from "@/features/setting/ProfileForm"
import { getUserProfileAction } from "@/features/setting/getUserProfile.action"
import { redirect } from "next/navigation"

export default async function SettingsPage() {
  const result = await getUserProfileAction()

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
        <ProfileForm profile={result.data!.profile as Profile} />
      </div>
    </div>
  )
}
