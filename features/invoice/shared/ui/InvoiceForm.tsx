'use client'

import React, { useState, useEffect, useMemo } from "react"
import { useFieldArray } from "react-hook-form"
import { useSensors, useSensor, PointerSensor, KeyboardSensor } from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { createInvoiceAction } from '@/features/invoice/create/actions/createInvoice.action'
import { useInvoiceForm, InvoiceItem } from "@/features/invoice/shared/hooks/useInvoiceForm"
import { InvoiceFormProps } from "@/features/invoice/shared/types/invoice.types"
import { InvoiceFormView } from "@/features/invoice/shared/ui/InvoiceFormView"
import { useRouter } from "next/navigation"

export function InvoiceForm(props: InvoiceFormProps) {
  const router = useRouter()
  const [clients, setClients] = useState(props.clients)

  const {
    form,
    isLoading,
    error,
    onSubmit,
  } = useInvoiceForm({
    invoice: props.invoice,
    invoiceItems: props.invoiceItems,
    clients: clients,
    defaultCurrency: props.defaultCurrency,
    createInvoiceAction,
    onSubmitSuccess: () => router.push("/dashboard/invoices"),
  })

  // Field array for invoice items
  const { control, handleSubmit, watch, setValue } = form
  const { fields, append, remove, move } = useFieldArray({ control, name: "items" })

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  // DnD handler
  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((item) => item.id === active.id)
      const newIndex = fields.findIndex((item) => item.id === over.id)
      move(oldIndex, newIndex)
    }
  }

  // Keep all item tax_rate in sync with global
  const tax_rate = watch("tax_rate")
  useEffect(() => {
    watch("items").forEach((_: any, idx: number) => setValue(`items.${idx}.tax_rate`, Number(tax_rate)))
  }, [tax_rate])

  // Calculations
  const items = watch("items")
  const currency = watch("currency")
  const subtotal = useMemo(() => items.reduce((sum: number, item: InvoiceItem) => sum + Number(item.quantity) * Number(item.unit_price), 0), [items])
  const tax = useMemo(() => (subtotal * Number(tax_rate)) / 100, [subtotal, tax_rate])
  const total = useMemo(() => subtotal + tax, [subtotal, tax])

  // Handle client created inline
  const handleClientCreated = (client: any) => {
    setClients((prev) => [...prev, client])
    setValue('client_id', client.id)
  }

  return (
    <InvoiceFormView
      form={form}
      control={control}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      error={error}
      isLoading={isLoading}
      fields={fields}
      append={append}
      remove={remove}
      move={move}
      sensors={sensors}
      handleDragEnd={handleDragEnd}
      tax_rate={tax_rate}
      currency={currency}
      subtotal={subtotal}
      tax={tax}
      total={total}
      clients={clients}
      handleClientCreated={handleClientCreated}
      invoice={props.invoice}
      onCancel={() => router.push("/dashboard/invoices")}
    />
  )
} 