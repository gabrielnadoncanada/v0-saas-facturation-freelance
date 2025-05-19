import { InvoiceDetails } from "@/features/invoice/shared/ui/InvoiceDetails"
import { getInvoiceAction } from "@/features/invoice/shared/actions/getInvoice.action" 
import { redirect } from "next/navigation"

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
