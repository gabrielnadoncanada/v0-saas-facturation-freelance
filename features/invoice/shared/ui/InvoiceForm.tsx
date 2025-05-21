'use client'

import React, { useState, useEffect, useMemo } from "react"
import { useForm, useFieldArray, FormProvider } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, Plus, Percent } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/shared/lib/utils"
import { DatePicker } from "@/components/ui/date-picker"
import { DndContext, closestCenter, useSensors, useSensor, PointerSensor, KeyboardSensor } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { InvoiceGeneralFields } from "@/features/invoice/shared/ui/InvoiceGeneralFields"
import { InvoiceLineFields } from "@/features/invoice/shared/ui/InvoiceLineFields"
import { createInvoiceAction } from '@/features/invoice/create/actions/createInvoice.action'
import { useInvoiceForm } from "@/features/invoice/shared/hooks/useInvoiceForm"
import { InvoiceFormProps } from "@/features/invoice/shared/types/invoice.types"
import { InvoiceFormView } from "@/features/invoice/shared/ui/InvoiceFormView"

// --- Types & Defaults ---
interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unit_price: number
  tax_rate: number
  amount: number
  isNew?: boolean
}

interface InvoiceFormValues {
  client_id: string
  issue_date: Date | null
  due_date: Date | null
  status: string
  currency: string
  notes: string
  tax_rate: number
  items: InvoiceItem[]
}

export type { InvoiceFormValues };

export function InvoiceForm(props: InvoiceFormProps) {
  const router = typeof window !== 'undefined' ? require('next/navigation').useRouter() : { push: () => {} }
  const {
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
  } = useInvoiceForm(props)

  const [clients, setClients] = useState(props.clients)

  const handleClientCreated = (client: any) => {
    setClients((prev) => [...prev, client])
    form.setValue('client_id', client.id)
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