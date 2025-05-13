import { ClientForm } from "@/components/features/clients/client-form"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function NewClientPage() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nouveau client</h1>
        <p className="text-muted-foreground">Créez un nouveau client</p>
      </div>

      <ClientForm isEdit={false} />
    </div>
  )
}
