import { notFound } from "next/navigation"
import { InvoiceForm } from "@/components/features/invoices/invoice-form"
import { getNewInvoiceData } from "@/app/actions/invoices"

export default async function NewInvoicePage() {
  // Utiliser le Server Action pour récupérer toutes les données nécessaires
  const result = await getNewInvoiceData()

  // Gérer les erreurs
  if (!result.success) {
    notFound()
  }

  const { clients, defaultCurrency, userId } = result.data

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nouvelle facture</h1>
        <p className="text-muted-foreground">Créez une nouvelle facture</p>
      </div>

      <InvoiceForm userId={userId} clients={clients} defaultCurrency={defaultCurrency} />
    </div>
  )
}
