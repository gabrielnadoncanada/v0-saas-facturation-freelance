import { useState } from "react"
import { useRouter } from "next/navigation"
import { deletePaymentAction } from "@/features/payment/delete/actions/deletePayment.action"
import { Payment } from "@/features/payment/shared/types/payment.types"
import { getPaymentMethodLabel } from "@/features/payment/shared/utils/paymentMethod"

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