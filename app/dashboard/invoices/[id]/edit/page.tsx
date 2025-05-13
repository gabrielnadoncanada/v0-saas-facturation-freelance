import { notFound } from "next/navigation"
import { InvoiceForm } from "@/components/features/invoices/invoice-form"
import { getInvoiceData } from "@/app/actions/invoices"

interface EditInvoicePageProps {
  params: {
    id: string
  }
}

export default async function EditInvoicePage({ params }: EditInvoicePageProps) {
  // Utiliser le Server Action pour récupérer toutes les données nécessaires
  const result = await getInvoiceData(params.id)

  // Gérer les erreurs
  if (!result.success) {
    notFound()
  }

  const { invoice, invoiceItems, clients, defaultCurrency, userId } = result.data

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Modifier la facture</h1>
        <p className="text-muted-foreground">Modifiez les détails de la facture</p>
      </div>

      <InvoiceForm
        userId={userId}
        clients={clients}
        invoice={invoice}
        invoiceItems={invoiceItems}
        defaultCurrency={defaultCurrency}
      />
    </div>
  )
}
