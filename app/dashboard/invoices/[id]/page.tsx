import { InvoiceDetails } from "@/components/features/invoices/invoice-details"
import { getInvoiceDetails } from "@/app/actions/invoices"
import { notFound, redirect } from "next/navigation"

export default async function InvoiceDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  // Récupérer les détails de la facture via le Server Action
  const result = await getInvoiceDetails(params.id)

  // Gérer les erreurs
  if (!result.success) {
    if (result.error === "Non authentifié") {
      redirect("/login")
    }
    notFound()
  }

  // Extraire les données
  const { invoice, invoiceItems, payments } = result.data

  return (
    <div className="flex flex-col gap-6">
      <InvoiceDetails invoice={invoice} invoiceItems={invoiceItems} payments={payments} userId={invoice.user_id} />
    </div>
  )
}
