import type { Invoice } from "@/shared/types/invoices/invoice"
import type { InvoiceItem } from "@/shared/types/invoices/invoice"
import type { Payment } from "@/shared/types/payments/payment"

export interface InvoiceDetailsProps {
  invoice: Invoice
  invoiceItems: InvoiceItem[]
}

export interface InvoiceLinesTableProps {
  invoiceItems: InvoiceItem[]
  currency: string
}

export interface InvoicePaymentsTableProps {
  payments: Payment[]
  currency: string
} 