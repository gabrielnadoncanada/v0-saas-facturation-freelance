"use client"

import { usePaymentsTable } from "@/features/payment/list/hooks/usePaymentsTable"
import { PaymentsTableView } from "@/features/payment/list/ui/PaymentsTableView"
import { Payment } from "@/features/payment/shared/types/payment.types"

export function PaymentsTable({ payments }: { payments: Payment[] }) {
  const {
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
  } = usePaymentsTable(payments)

  return (
    <PaymentsTableView
      filteredPayments={filteredPayments}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      deleteDialogOpen={deleteDialogOpen}
      setDeleteDialogOpen={setDeleteDialogOpen}
      paymentToDelete={paymentToDelete}
      setPaymentToDelete={setPaymentToDelete}
      isDeleting={isDeleting}
      handleDelete={handleDelete}
      getPaymentMethodLabel={getPaymentMethodLabel}
      router={router}
    />
  )
}
