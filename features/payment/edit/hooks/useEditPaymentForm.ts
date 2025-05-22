import React from "react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { updatePaymentAction } from "@/features/payment/edit/actions/updatePayment.action"
import { Payment } from "@/features/payment/shared/types/payment.types"
import { Invoice } from "@/features/invoice/shared/types/invoice.types"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { PaymentFormData } from "@/features/payment/shared/types/payment.types"

const paymentFormSchema = z.object({
  invoice_id: z.string().min(1, "La facture est requise"),
  amount: z.number().min(0.01, "Le montant doit être positif"),
  payment_date: z.date({ required_error: "La date est requise" }),
  payment_method: z.string().min(1, "La méthode est requise"),
  notes: z.string(),
})

export type PaymentFormSchema = z.infer<typeof paymentFormSchema>

function usePaymentForm(defaults: Partial<PaymentFormSchema> = {}) {
  return useForm<PaymentFormSchema>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      invoice_id: defaults.invoice_id || "",
      amount: defaults.amount ?? 0,
      payment_date: defaults.payment_date ? new Date(defaults.payment_date) : new Date(),
      payment_method: defaults.payment_method || "transfer",
      notes: defaults.notes || "",
    },
    mode: "onBlur",
  })
}

export function useEditPaymentForm(payment: Payment, invoices: Invoice[]) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(
    invoices.find((inv) => inv.id === payment.invoice_id) || null
  )

  const form = usePaymentForm({
    invoice_id: payment.invoice_id,
    amount: payment.amount,
    payment_date: new Date(payment.payment_date),
    payment_method: payment.payment_method,
    notes: payment.notes || "",
  })

  const invoiceId = useWatch({
    control: form.control,
    name: "invoice_id",
  })

  React.useEffect(() => {
    const invoice = invoices.find((inv) => inv.id === invoiceId)
    setSelectedInvoice(invoice || null)
    // Optionally update amount to match invoice total if needed
    // if (invoice && form.watch("amount") !== invoice.total) {
    //   form.setValue("amount", invoice.total)
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceId])

  const onSubmit = async (values: PaymentFormSchema) => {
    setIsLoading(true)
    setError(null)
    const result = await updatePaymentAction(payment.id, values as PaymentFormData)
    if (result.success) {
      router.push("/dashboard/payments")
      router.refresh()
    } else {
      setError(result.error || "Une erreur est survenue")
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    selectedInvoice,
    form,
    onSubmit,
    router,
  }
} 