import { PaymentsTable } from "@/components/features/payments/payments-table"
import { Button } from "@/components/ui/button"
import { getAllPayments } from "@/app/actions/payments"
import { Plus } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function PaymentsPage() {
  const { payments, error } = await getAllPayments()

  if (error === "Non authentifié") {
    redirect("/login")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paiements</h1>
          <p className="text-muted-foreground">Gérez les paiements reçus pour vos factures</p>
        </div>
        <Link href="/dashboard/payments/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau paiement
          </Button>
        </Link>
      </div>

      <PaymentsTable payments={payments} />
    </div>
  )
}
