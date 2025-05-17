import { InvoiceForm } from "@/features/invoice/shared/ui/InvoiceForm"
import { fetchAllClients } from "@/features/client"
import { getSessionUser } from "@/shared/utils/getSessionUser"
import { fetchDefaultCurrency } from "@/features/invoice/view/model/fetchDefaultCurrency"

export default async function NewInvoicePage() {
  const clients = await fetchAllClients()
  const defaultCurrency = await fetchDefaultCurrency()
  const { user } = await getSessionUser()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nouvelle facture</h1>
        <p className="text-muted-foreground">Créez une nouvelle facture</p>
      </div>
      <InvoiceForm userId={user.id} clients={clients} defaultCurrency={defaultCurrency} />
    </div>
  )
}
