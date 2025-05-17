import { useState } from "react"
import { useRouter } from "next/navigation"
import { deletePaymentAction } from "@/features/payment/delete/actions/deletePayment.action"
import { Payment } from "@/shared/types/payments/payment"

export function usePaymentsTable(payments: Payment[]) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [paymentToDelete, setPaymentToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filteredPayments = payments.filter(
    (payment) =>
      payment.invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoice.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.payment_method.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async () => {
    if (!paymentToDelete) return
    setIsDeleting(true)
    try {
      const result = await deletePaymentAction(paymentToDelete)
      if (result.success) {
        router.refresh()
      } else {
        console.error(result.error)
      }
    } catch (error) {
      console.error("Failed to delete payment:", error)
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setPaymentToDelete(null)
    }
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "card":
        return "Carte bancaire"
      case "cash":
        return "Espèces"
      case "transfer":
        return "Virement"
      case "stripe":
        return "Stripe"
      default:
        return method
    }
  }

  return {
    searchTerm,
    setSearchTerm,
    deleteDialogOpen,
    setDeleteDialogOpen,
    paymentToDelete,
    setPaymentToDelete,
    isDeleting,
    filteredPayments,
    handleDelete,
    getPaymentMethodLabel,
    router,
  }
} 