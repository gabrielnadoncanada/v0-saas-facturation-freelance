import { useState } from "react"
import { useRouter } from "next/navigation"
import { deletePaymentAndUpdateInvoiceAction } from "@/features/payment/delete/actions/deletePaymentAndUpdateInvoice.action"
import { Payment } from "@/features/payment/shared/types/payment.types"
import { getPaymentMethodLabel } from "@/features/payment/shared/utils/paymentMethod"

export function usePaymentDetails(payment: Payment) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)


  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const result = await deletePaymentAndUpdateInvoiceAction(payment.id)
      if (!result.success) {
        console.error("Erreur lors de la suppression:", result.error)
        return
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