import { useState } from "react"
import { useForm } from "react-hook-form"
import { InvoiceFormProps } from "@/features/invoice/shared/types/invoice.types"

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unit_price: number
  tax_rate: number
  amount: number
  isNew?: boolean
}

export interface InvoiceFormValues {
  client_id: string
  issue_date: Date | null
  due_date: Date | null
  status: string
  currency: string
  notes: string
  tax_rate: number
  items: InvoiceItem[]
}

interface UseInvoiceFormOptions {
  invoice?: any
  invoiceItems?: InvoiceItem[]
  clients: any[]
  defaultCurrency?: string
  onSubmitSuccess?: () => void
  createInvoiceAction: (invoice: any, items: any[]) => Promise<any>
}

function getDefaultValues({ invoice, invoiceItems = [], defaultCurrency }: UseInvoiceFormOptions): InvoiceFormValues {
  return {
    client_id: invoice?.client.id || "",
    issue_date: invoice?.issue_date ? new Date(invoice.issue_date) : new Date(),
    due_date: invoice?.due_date ? new Date(invoice.due_date) : new Date(new Date().setDate(new Date().getDate() + 30)),
    status: invoice?.status || "draft",
    currency: invoice?.currency || defaultCurrency || "EUR",
    notes: invoice?.notes || "",
    tax_rate: invoice?.tax_rate || 20,
    items:
      invoiceItems.length > 0
        ? invoiceItems.map((item) => ({ ...item, tax_rate: invoice?.tax_rate || 20, isNew: false }))
        : [{ id: "new-item-" + Date.now(), description: "", quantity: 1, unit_price: 0, tax_rate: invoice?.tax_rate || 20, amount: 0, isNew: true }],
  }
}

function mapInvoicePayload(data: InvoiceFormValues, clients: any[], subtotal: number, tax: number, total: number) {
  return {
    id: '',
    client_id: data.client_id,
    issue_date: data.issue_date ? data.issue_date.toISOString() : new Date().toISOString(),
    due_date: data.due_date ? data.due_date.toISOString() : new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
    status: data.status,
    currency: data.currency,
    notes: data.notes,
    tax_rate: data.tax_rate,
    subtotal: subtotal,
    tax_total: tax,
    total: total,
    language: 'fr',
    invoice_number: '',
    client: clients.find((c) => c.id === data.client_id) || {},
    payments: [],
  }
}

function mapItemsPayload(data: InvoiceFormValues) {
  return data.items.map((item, idx) => ({
    id: item.id,
    invoice_id: '',
    description: item.description,
    quantity: Number(item.quantity),
    unit_price: Number(item.unit_price),
    tax_rate: Number(item.tax_rate),
    amount: Number(item.quantity) * Number(item.unit_price),
    position: idx,
    isNew: item.isNew,
  }))
}

export function useInvoiceForm({
  invoice,
  invoiceItems,
  clients,
  defaultCurrency,
  onSubmitSuccess,
  createInvoiceAction,
}: UseInvoiceFormOptions) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<InvoiceFormValues>({
    defaultValues: getDefaultValues({ invoice, invoiceItems, defaultCurrency, clients, createInvoiceAction }),
    mode: "onBlur",
  })

  const onSubmit = async (data: InvoiceFormValues) => {
    setIsLoading(true)
    setError(null)
    if (!data.client_id) {
      setError("Informations manquantes")
      setIsLoading(false)
      return
    }
    // Calculate subtotal, tax, total
    const subtotal = data.items.reduce((sum, item) => sum + Number(item.quantity) * Number(item.unit_price), 0)
    const tax = (subtotal * Number(data.tax_rate)) / 100
    const total = subtotal + tax
    try {
      await createInvoiceAction(
        mapInvoicePayload(data, clients, subtotal, tax, total),
        mapItemsPayload(data)
      )
      setIsLoading(false)
      if (onSubmitSuccess) onSubmitSuccess()
    } catch (err: any) {
      setError(err.message || "Une erreur inattendue est survenue")
      setIsLoading(false)
    }
  }

  return {
    form,
    isLoading,
    error,
    onSubmit,
  }
} 