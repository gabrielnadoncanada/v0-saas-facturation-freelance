import { EditPaymentForm } from "@/features/payment/edit/ui/EditPaymentForm"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getPaymentAction } from "@/features/payment/shared/actions/getPayment.action"
import { redirect } from "next/navigation"
import { getInvoicesAction } from "@/features/invoice/list/actions/getInvoices.action"

export default async function EditPaymentPage({ params }: { params: { id: string } }) {
  const result = await getPaymentAction(params.id)
  const invoices = await getInvoicesAction()

  if (!result.success || !invoices.success) {
    redirect("/login")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/payments">
          <Button variant="outline" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Modifier le paiement</h1>
            <p className="text-muted-foreground">
              Facture {result.data?.invoice?.invoice_number} - {result.data?.invoice?.client?.name}
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <EditPaymentForm payment={result.data!} invoices={invoices.data!} />
      </div>
    </div>
  )
}
