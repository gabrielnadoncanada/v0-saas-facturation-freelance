import { useState } from "react"
import { createClient } from "@/shared/lib/supabase/client"

interface UsePaymentFormProps {
  invoiceId: string
  balanceDue: number
  currency: string
  onSuccess?: () => void
}

export function usePaymentForm({ invoiceId, balanceDue, currency, onSuccess }: UsePaymentFormProps) {
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

  return {
    formData,
    isLoading,
    error,
    handleChange,
    handleSubmit,
    setFormData,
  }
} 