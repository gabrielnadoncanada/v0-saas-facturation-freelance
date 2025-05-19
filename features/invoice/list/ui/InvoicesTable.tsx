"use client"

import { useInvoicesTable } from "@/features/invoice/list/hooks/useInvoicesTable"
import { InvoicesTableView } from "@/features/invoice/list/ui/InvoicesTableView"
import { Invoice } from "@/features/invoice/shared/types/invoice.types"

export function InvoicesTable({ invoices }: { invoices: Invoice[] }) {
  const {
    searchTerm,
    setSearchTerm,
    deleteDialogOpen,
    setDeleteDialogOpen,
    invoiceToDelete,
    setInvoiceToDelete,
    filteredInvoices,
    handleDelete,
    getStatusLabel,
    router,
  } = useInvoicesTable(invoices)

  return (
    <InvoicesTableView
      filteredInvoices={filteredInvoices}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      deleteDialogOpen={deleteDialogOpen}
      setDeleteDialogOpen={setDeleteDialogOpen}
      invoiceToDelete={invoiceToDelete}
      setInvoiceToDelete={setInvoiceToDelete}
      handleDelete={handleDelete}
      getStatusLabel={getStatusLabel}
      router={router}
    />
  )
}
