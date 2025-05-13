import { InvoicesTable } from "@/components/features/invoices/invoices-table"
import { Button } from "@/components/ui/button"
import { getAllInvoices } from "@/app/actions/invoices"
import { Plus } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function InvoicesPage() {
  const result = await getAllInvoices()

  if (!result.success) {
    if (result.error === "Non authentifié") {
      redirect("/login")
    }
    // Gérer d'autres erreurs si nécessaire
    return <div>Erreur: {result.error}</div>
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Factures</h1>
          <p className="text-muted-foreground">Gérez vos factures et suivez leur statut</p>
        </div>
        <Link href="/dashboard/invoices/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle facture
          </Button>
        </Link>
      </div>

      <InvoicesTable invoices={result.data || []} />
    </div>
  )
}
