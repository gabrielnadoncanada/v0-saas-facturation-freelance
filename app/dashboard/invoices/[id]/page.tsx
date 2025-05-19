import { InvoiceDetails } from "@/features/invoice/shared/ui/InvoiceDetails"
import { getInvoiceAction } from "@/features/invoice/shared/actions/getInvoice.action" 
import { notFound, redirect } from "next/navigation"
import { Invoice, InvoiceItem } from "@/features/invoice/shared/types/invoice.types"
import { Payment } from "@/features/payment/shared/types/payment.types"

export default async function InvoiceDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const result = await getInvoiceAction(params.id)

  if (!result.success) {
    redirect("/login")
  }

  const { invoice, invoiceItems, clients, defaultCurrency } = result.data

  return (
    <div className="flex flex-col gap-6">
      <InvoiceDetails invoice={invoice} invoiceItems={invoiceItems} clients={clients} defaultCurrency={defaultCurrency} />
    </div>
  )
}
