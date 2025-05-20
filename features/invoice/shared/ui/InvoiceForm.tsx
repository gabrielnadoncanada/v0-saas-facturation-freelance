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
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Informations générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InvoiceGeneralFields control={control} clients={clients} onClientCreated={handleClientCreated} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Récapitulatif</CardTitle>
                {props.invoice && <div className="text-lg font-semibold">{props.invoice.invoice_number}</div>}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sous-total HT</span>
                    <span>{formatCurrency(subtotal, currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">TVA ({tax_rate}%)</span>
                    <span>{formatCurrency(tax, currency)}</span>
                  </div>
                  <div className="flex justify-between font-semibold mt-4 text-lg">
                    <span>Total TTC</span>
                    <span>{formatCurrency(total, currency)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card className="overflow-hidden">
            <InvoiceLineFields
              fields={fields}
              control={control}
              append={append}
              remove={remove}
              move={move}
              sensors={sensors}
              handleDragEnd={handleDragEnd}
              tax_rate={tax_rate}
              currency={currency}
            />
            <div className="border-t border-border bg-muted/30 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-muted-foreground">
                  {fields.length} {fields.length > 1 ? "lignes" : "ligne"} au total
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Total HT:</span>
                    <span className="font-medium">{formatCurrency(subtotal, currency)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">TVA ({tax_rate}%):</span>
                    <span className="font-medium">{formatCurrency(tax, currency)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Total TTC:</span>
                    <span className="text-lg font-semibold">{formatCurrency(total, currency)}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:space-x-4">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard/invoices") } className="w-full sm:w-auto">Annuler</Button>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {props.invoice ? "Mettre à jour" : "Créer la facture"}
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  )
} 