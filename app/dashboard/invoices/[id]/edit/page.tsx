import { InvoiceForm } from "@/features/invoice/shared/ui/InvoiceForm"
import { getInvoiceAction } from "@/features/invoice/shared/actions/getInvoice.action"



export default async function EditInvoicePage({ params }: { params: { id: string } }) {
  const result = await getInvoiceAction(params.id)

  const { invoice, invoiceItems, clients, defaultCurrency } = result.data

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Modifier la facture</h1>
        <p className="text-muted-foreground">Modifiez les détails de la facture</p>
      </div>

      <InvoiceForm
        clients={clients}
        invoice={invoice}
        invoiceItems={invoiceItems}
        defaultCurrency={defaultCurrency}
      />
    </div>
  )
}
