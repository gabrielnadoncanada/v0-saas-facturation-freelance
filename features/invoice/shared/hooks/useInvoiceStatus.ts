export function useInvoiceStatus() {
  const getStatusLabel = (status: string): string => {
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

  return { getStatusLabel }
}
