import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/shared/lib/supabase/client"
import { Payment } from "@/features/payment/shared/types/payment.types"
import { getPaymentMethodLabel } from "@/features/payment/shared/utils/paymentMethod"

export function usePaymentDetails(payment: Payment) {
  const router = useRouter()
  const supabase = createClient()
  const [isDeleting, setIsDeleting] = useState(false)


  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      // Supprimer le paiement
      const { error } = await supabase.from("payments").delete().eq("id", payment.id)

      if (error) {
        console.error("Erreur lors de la suppression:", error)
        return
      }

      // Vérifier s'il reste des paiements pour cette facture
      const { data: remainingPayments } = await supabase
        .from("payments")
        .select("amount")
        .eq("invoice_id", payment.invoice_id)

      // Si la facture était marquée comme payée et qu'il n'y a plus assez de paiements, la remettre en "sent"
      if (payment.invoice && payment.invoice.status === "paid") {
        const totalPaid = remainingPayments?.reduce((sum, p) => sum + p.amount, 0) || 0

        if (totalPaid < payment.invoice.total) {
          await supabase.from("invoices").update({ status: "sent" }).eq("id", payment.invoice_id)
        }
      }

      // Rediriger vers la liste des paiements
      router.push("/dashboard/payments")
      router.refresh()
    } catch (err) {
      console.error("Erreur:", err)
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    isDeleting,
    handleDelete,
    getPaymentMethodLabel,
  }
} 