import { InvoiceDetails } from "@/components/invoices/invoice-details"
import { getInvoiceAction } from "@/features/invoice/view/getInvoice.action" 
import { notFound, redirect } from "next/navigation"
import { Invoice, InvoiceItem } from "@/types/invoices/invoice"
import { Payment } from "@/types/payments/payment"

export default async function InvoiceDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  // Récupérer les détails de la facture via le Server Action
  const result = await getInvoiceAction(params.id)

  // Gérer les erreurs
  if (!result.success) {
    if (result.error === "Non authentifié") {
      redirect("/login")
    }
    notFound()
  }

  // Extraire les données
  const { invoice, invoiceItems, payments } = result.data as { invoice: Invoice; invoiceItems: InvoiceItem[]; payments: Payment[] }

  return (
    <div className="flex flex-col gap-6">
      <InvoiceDetails invoice={invoice} invoiceItems={invoiceItems} payments={payments} userId={invoice.user_id} />
    </div>
  )
}
