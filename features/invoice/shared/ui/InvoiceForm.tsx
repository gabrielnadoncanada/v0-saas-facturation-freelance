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
import type { InvoiceFormProps } from "../types/invoiceForm"
import { InvoiceGeneralFields } from "./InvoiceGeneralFields"
import { InvoiceLineFields } from "./InvoiceLineFields"

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

const getDefaultValues = (props: InvoiceFormProps & { userId: string | undefined }): InvoiceFormValues => {
  const { invoice, invoiceItems = [], defaultCurrency } = props
  return {
    client_id: invoice?.client_id || "",
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

// --- Main Component ---
export type { InvoiceFormValues };
export function InvoiceForm(props: InvoiceFormProps & { userId: string | undefined }) {
  const { clients, invoice, userId } = props
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = typeof window !== 'undefined' ? require('next/navigation').useRouter() : { push: () => {} }

  const form = useForm<InvoiceFormValues>({ defaultValues: getDefaultValues(props), mode: "onBlur" })
  const { control, handleSubmit, watch, setValue, getValues } = form
  const { fields, append, remove, move } = useFieldArray({ control, name: "items" })

  // Totals
  const items = watch("items")
  const tax_rate = watch("tax_rate")
  const currency = watch("currency")
  const subtotal = items.reduce((sum, item) => sum + Number(item.quantity) * Number(item.unit_price), 0)
  const tax = (subtotal * Number(tax_rate)) / 100
  const total = subtotal + tax

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
    if (!userId || !data.client_id) {
      setError("Informations manquantes")
      setIsLoading(false)
      return
    }
    try {
      // TODO: Call your create/update invoice action here
      setIsLoading(false)
      router.push("/dashboard/invoices")
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
                <InvoiceGeneralFields control={control} clients={clients} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Récapitulatif</CardTitle>
                {invoice && <div className="text-lg font-semibold">{invoice.invoice_number}</div>}
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
              {invoice ? "Mettre à jour" : "Créer la facture"}
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  )
} 