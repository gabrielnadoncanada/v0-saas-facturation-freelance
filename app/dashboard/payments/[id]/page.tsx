import { notFound, redirect } from "next/navigation"
import { PaymentDetails } from "@/components/payments/payment-details"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getPaymentAction } from "@/actions/payments/get"

export default async function PaymentDetailsPage({ params }: { params: { id: string } }) {
  const result = await getPaymentAction(params.id)

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
            Facture {result.data!.payment.invoice_number} - {result.data!.payment.client_name}
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <PaymentDetails payment={result.data!.payment} />
      </div>
    </div>
  )
}
