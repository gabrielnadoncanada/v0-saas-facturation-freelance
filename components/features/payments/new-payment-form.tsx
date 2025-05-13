"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/lib/utils"
import { DatePicker } from "@/components/ui/date-picker"
import { createPayment, type Invoice } from "@/app/actions/payments"

interface NewPaymentFormProps {
  invoices: Invoice[]
}

export function NewPaymentForm({ invoices }: NewPaymentFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  const [formData, setFormData] = useState({
    invoice_id: "",
    amount: 0,
    payment_date: new Date(),
    payment_method: "transfer",
    notes: "",
  })

  const handleInvoiceChange = (invoiceId: string) => {
    const invoice = invoices.find((inv) => inv.id === invoiceId)
    setSelectedInvoice(invoice || null)

    setFormData((prev) => ({
      ...prev,
      invoice_id: invoiceId,
      amount: invoice ? invoice.total : 0,
    }))
  }

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const result = await createPayment(formData)

    if (result.success) {
      router.push("/dashboard/payments")
      router.refresh()
    } else {
      setError(result.error || "Une erreur est survenue")
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Informations du paiement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="invoice_id">
              Facture <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.invoice_id} onValueChange={handleInvoiceChange}>
              <SelectTrigger id="invoice_id">
                <SelectValue placeholder="Sélectionner une facture" />
              </SelectTrigger>
              <SelectContent>
                {invoices.map((invoice) => (
                  <SelectItem key={invoice.id} value={invoice.id}>
                    {invoice.invoice_number} - {invoice.clients.name} ({formatCurrency(invoice.total)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">
              Montant <span className="text-red-500">*</span>
            </Label>
            <Input
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              value={formData.amount}
              onChange={(e) => handleChange("amount", Number.parseFloat(e.target.value))}
              required
            />
            {selectedInvoice && (
              <p className="text-sm text-muted-foreground">
                Montant total de la facture: {formatCurrency(selectedInvoice.total)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_date">
              Date de paiement <span className="text-red-500">*</span>
            </Label>
            <DatePicker date={formData.payment_date} setDate={(date) => handleChange("payment_date", date)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_method">
              Méthode de paiement <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.payment_method} onValueChange={(value) => handleChange("payment_method", value)}>
              <SelectTrigger id="payment_method">
                <SelectValue placeholder="Sélectionner une méthode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">Carte bancaire</SelectItem>
                <SelectItem value="cash">Espèces</SelectItem>
                <SelectItem value="transfer">Virement</SelectItem>
                <SelectItem value="stripe">Stripe</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Informations supplémentaires..."
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()} disabled={isLoading}>
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading || !formData.invoice_id}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enregistrer le paiement
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
