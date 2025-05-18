import { InvoiceDetails } from "@/features/invoice/shared/ui/InvoiceDetails"
import { getInvoiceAction } from "@/features/invoice/shared/actions/getInvoice.action" 
import { notFound, redirect } from "next/navigation"
import { Invoice, InvoiceItem } from "@/shared/types/invoices/invoice"
import { Payment } from "@/shared/types/payments/payment"

export default async function InvoiceDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const result = await getInvoiceAction(params.id)

  // Extraire les données
  const { invoice, invoiceItems } = result.data as { invoice: Invoice; invoiceItems: InvoiceItem[]}

  return (
    <div className="flex flex-col gap-6">
      <InvoiceDetails invoice={invoice} invoiceItems={invoiceItems} />
    </div>
  )
}
