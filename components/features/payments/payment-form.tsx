"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/lib/utils"
import { DatePicker } from "@/components/ui/date-picker"

interface PaymentFormProps {
  invoiceId: string
  balanceDue: number
  currency: string
  onSuccess?: () => void
}

export function PaymentForm({ invoiceId, balanceDue, currency, onSuccess }: PaymentFormProps) {
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    amount: balanceDue,
    payment_date: new Date(),
    payment_method: "transfer",
    notes: "",
  })

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error: insertError } = await supabase.from("payments").insert({
        invoice_id: invoiceId,
        amount: formData.amount,
        payment_date: formData.payment_date.toISOString().split("T")[0],
        payment_method: formData.payment_method,
        notes: formData.notes,
      })

      if (insertError) {
        setError(insertError.message)
        return
      }

      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      setError("Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="amount">Montant</Label>
        <Input
          id="amount"
          type="number"
          min="0.01"
          step="0.01"
          max={balanceDue}
          value={formData.amount}
          onChange={(e) => handleChange("amount", Number.parseFloat(e.target.value))}
          required
        />
        <p className="text-sm text-muted-foreground">Solde dû: {formatCurrency(balanceDue, currency)}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="payment_date">Date de paiement</Label>
        <DatePicker date={formData.payment_date} setDate={(date) => handleChange("payment_date", date)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="payment_method">Méthode de paiement</Label>
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
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Enregistrer le paiement
        </Button>
      </div>
    </form>
  )
}
