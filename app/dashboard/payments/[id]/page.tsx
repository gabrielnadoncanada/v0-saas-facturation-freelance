import { notFound, redirect } from "next/navigation"
import { PaymentDetails } from "@/features/payment/view/ui/PaymentDetails"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getPaymentAction } from "@/features/payment/shared/actions/getPayment.action"
import { getInvoicesAction } from "@/features/invoice/list/actions/getInvoices.action"

export default async function PaymentDetailsPage({ params }: { params: { id: string } }) {
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
          <h1 className="text-3xl font-bold tracking-tight">Détails du paiement</h1>
          <p className="text-muted-foreground">
            Facture {result.data?.invoice?.invoice_number} - {result.data?.invoice?.client?.name}
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <PaymentDetails payment={result.data!} />
      </div>
    </div>
  )
}
