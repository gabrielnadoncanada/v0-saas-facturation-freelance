import { InvoicesTable } from "@/features/invoice/list/InvoicesTable"
import { Button } from "@/components/ui/button"
import { getAllInvoicesAction } from "@/features/invoice/list/actions/getAllInvoices.action"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function InvoicesPage() {
  const result = await getAllInvoicesAction()

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

      <InvoicesTable invoices={result} />
    </div>
  )
}
