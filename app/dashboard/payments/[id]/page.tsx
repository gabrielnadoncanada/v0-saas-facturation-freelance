import { notFound, redirect } from "next/navigation"
import { PaymentDetails } from "@/components/features/payments/payment-details"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getPaymentData } from "@/app/actions/payments"

export default async function PaymentDetailsPage({ params }: { params: { id: string } }) {
  const { payment, error } = await getPaymentData(params.id)

  if (error === "Non authentifié") {
    redirect("/login")
  }

  if (error || !payment) {
    notFound()
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
            Facture {payment.invoices.invoice_number} - {payment.invoices.clients.name}
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <PaymentDetails payment={payment} />
      </div>
    </div>
  )
}
