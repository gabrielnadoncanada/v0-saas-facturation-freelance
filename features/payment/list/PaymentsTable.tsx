"use client"

import { usePaymentsTable } from "./hooks/usePaymentsTable"
import { PaymentsTableView } from "./ui/PaymentsTableView"
import { Payment } from "@/shared/types/payments/payment"

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
