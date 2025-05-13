import { ClientsTable } from "@/components/features/clients/clients-table"
import { Button } from "@/components/ui/button"
import { getAllClients } from "@/app/actions/clients"
import { Plus } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function ClientsPage() {
  const result = await getAllClients()

  if (!result.success) {
    if (result.error === "Utilisateur non authentifié") {
      redirect("/login")
    }
    // Gérer d'autres erreurs potentielles ici
    return <div>Une erreur s'est produite: {result.error}</div>
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">Gérez vos clients et leurs informations</p>
        </div>
        <Link href="/dashboard/clients/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau client
          </Button>
        </Link>
      </div>

      <ClientsTable clients={result.data || []} />
    </div>
  )
}
