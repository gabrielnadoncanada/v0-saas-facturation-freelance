import { InvoiceForm } from "@/features/invoice/shared/ui/InvoiceForm"
import { getInvoiceAction } from "@/features/invoice/shared/actions/getInvoice.action"
import { redirect } from "next/navigation"
import FormPageLayout from "@/components/layout/FormPageLayout"

export default async function EditInvoicePage({ params }: { params: { id: string } }) {
  const result = await getInvoiceAction(params.id)

  if (!result.success) {
    redirect("/login")
  }

  const { clients, invoice, invoiceItems, defaultCurrency } = result.data

  return (
    <FormPageLayout
      title="Modifier la facture"
      subtitle="Modifiez les détails de la facture"
      backHref="/dashboard/invoices"
    >     
      <InvoiceForm
        clients={clients}
        invoice={invoice}
        invoiceItems={invoiceItems}
        defaultCurrency={defaultCurrency}
      />
    </FormPageLayout>
  )
}
