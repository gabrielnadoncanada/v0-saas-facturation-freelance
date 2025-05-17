import { useState } from "react"
import { useRouter } from "next/navigation"
import { deleteInvoiceAction } from "@/features/invoice/delete/actions/deleteInvoice.action"
import { Invoice } from "@/shared/types/invoices/invoice"

export function useInvoicesTable(invoices: Invoice[]) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null)

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async () => {
    if (!invoiceToDelete) return
    await deleteInvoiceAction(invoiceToDelete)
    setDeleteDialogOpen(false)
    setInvoiceToDelete(null)
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "draft":
        return "Brouillon"
      case "sent":
        return "Envoyée"
      case "paid":
        return "Payée"
      case "overdue":
        return "En retard"
      default:
        return status
    }
  }

  return {
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
  }
} 