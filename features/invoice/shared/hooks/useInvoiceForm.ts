import { useState, useEffect, useMemo } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { useSensors, useSensor, PointerSensor, KeyboardSensor } from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { InvoiceFormProps } from "@/features/invoice/shared/types/invoice.types"
import { createInvoiceAction } from '@/features/invoice/create/actions/createInvoice.action'

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

function getDefaultValues(props: InvoiceFormProps): InvoiceFormValues {
  const { invoice, invoiceItems = [], defaultCurrency } = props
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

export function useInvoiceForm(props: InvoiceFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<InvoiceFormValues>({ defaultValues: getDefaultValues(props), mode: "onBlur" })
  const { control, handleSubmit, watch, setValue, getValues } = form
  const { fields, append, remove, move } = useFieldArray({ control, name: "items" })

  // Memoized totals
  const items = watch("items")
  const tax_rate = watch("tax_rate")
  const currency = watch("currency")
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + Number(item.quantity) * Number(item.unit_price), 0), [items])
  const tax = useMemo(() => (subtotal * Number(tax_rate)) / 100, [subtotal, tax_rate])
  const total = useMemo(() => subtotal + tax, [subtotal, tax])

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  // Keep all item tax_rate in sync with global
  useEffect(() => {
    getValues("items").forEach((_, idx) => setValue(`items.${idx}.tax_rate`, Number(tax_rate)))
  }, [tax_rate])

  // Submission
  const onSubmit = async (data: InvoiceFormValues) => {
    setIsLoading(true)
    setError(null)
    if (!data.client_id) {
      setError("Informations manquantes")
      setIsLoading(false)
      return
    }
    try {
      await createInvoiceAction(
        mapInvoicePayload(data, props.clients, subtotal, tax, total),
        mapItemsPayload(data)
      )
      setIsLoading(false)
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue")
      setIsLoading(false)
    }
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((item) => item.id === active.id)
      const newIndex = fields.findIndex((item) => item.id === over.id)
      move(oldIndex, newIndex)
    }
  }

  return {
    form,
    control,
    handleSubmit,
    onSubmit,
    error,
    isLoading,
    fields,
    append,
    remove,
    move,
    sensors,
    handleDragEnd,
    tax_rate,
    currency,
    subtotal,
    tax,
    total,
  }
} 