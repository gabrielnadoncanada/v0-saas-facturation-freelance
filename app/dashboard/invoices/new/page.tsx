import { InvoiceForm } from "@/features/invoice/shared/ui/InvoiceForm"
import { getClients } from "@/features/client"
import { getDefaultCurrency } from "@/features/invoice/view/model/getDefaultCurrency"

export default async function NewInvoicePage() {
  const clients = await getClients()
  const defaultCurrency = await getDefaultCurrency()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nouvelle facture</h1>
        <p className="text-muted-foreground">Créez une nouvelle facture</p>
      </div>
      <InvoiceForm clients={clients} defaultCurrency={defaultCurrency} />
    </div>
  )
}
