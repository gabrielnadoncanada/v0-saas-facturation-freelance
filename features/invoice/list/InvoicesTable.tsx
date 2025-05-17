"use client"

import { useInvoicesTable } from "./hooks/useInvoicesTable"
import { InvoicesTableView } from "./ui/InvoicesTableView"
import { Invoice } from "@/shared/types/invoices/invoice"

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
