import { getClientAction } from "@/features/client/shared/actions/getClient.action"
import { ClientForm } from "@/features/client/shared/ui/ClientForm"
import { getInvoicesByClientAction } from "@/features/invoice/list/actions/getInvoicesByClient.action"
import { InvoicesTable } from "@/features/invoice/list/ui/InvoicesTable"
import FormPageLayout from "@/shared/ui/FormPageLayout"

export default async function EditClientPage({ params, }: { params: { id: string } }) {
  const result = await getClientAction(params.id)
  const invoicesResult = await getInvoicesByClientAction(params.id)

  if (!result.success) {
    return <div>{result.error}</div>
  }

  return (
    <FormPageLayout
      title="Modifier le client"
      subtitle="Modifiez les informations du client"
      backHref="/dashboard/clients"
    >
      <ClientForm client={result.data} />
      {invoicesResult.success && <InvoicesTable invoices={invoicesResult.data} />}
    </FormPageLayout>
  )
}
