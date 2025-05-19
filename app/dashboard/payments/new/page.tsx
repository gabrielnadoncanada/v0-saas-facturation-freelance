import { NewPaymentForm } from "@/features/payment/create/ui/NewPaymentForm"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getInvoicesAction } from "@/features/invoice/list/actions/getInvoices.action"

export default async function NewPaymentPage() {
  const result = await getInvoicesAction()

  if (!result.success) {
    return <div>Error: {result.error}</div>
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
          <h1 className="text-3xl font-bold tracking-tight">Nouveau paiement</h1>
          <p className="text-muted-foreground">Enregistrer un paiement pour une facture</p>
        </div>
      </div>

      <div className="grid gap-6">
        <NewPaymentForm invoices={result.data} />
      </div>
    </div>
  )
}
