import { NewPaymentForm } from "@/features/payment/create/ui/NewPaymentForm"
import { getInvoicesAction } from "@/features/invoice/list/actions/getInvoices.action"
import FormPageLayout from "@/components/layout/FormPageLayout"

export default async function NewPaymentPage() {
  const result = await getInvoicesAction()

  if (!result.success) {
    return <div>Error: {result.error}</div>
  }

  return (
    <FormPageLayout
      title="Nouveau paiement"
      subtitle="Enregistrer un paiement pour une facture"
      backHref="/dashboard/payments"
    >
      <NewPaymentForm invoices={result.data} />
    </FormPageLayout>
  )
}
