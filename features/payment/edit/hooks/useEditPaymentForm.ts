import React from "react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { updatePaymentAction } from "@/features/payment/edit/actions/updatePayment.action"
import { Payment } from "@/features/payment/shared/types/payment.types"
import { Invoice } from "@/features/invoice/shared/types/invoice.types"
import { PaymentFormData } from "@/features/payment/shared/types/payment.types"
import { PaymentFormSchema } from "@/features/payment/shared/schema/payment.schema"
import { usePaymentForm } from "@/shared/hooks/usePaymentForm"

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

  React.useEffect(() => {
    const invoice = invoices.find((inv) => inv.id === form.watch("invoice_id"))
    setSelectedInvoice(invoice || null)
    // Optionally update amount to match invoice total if needed
    // if (invoice && form.watch("amount") !== invoice.total) {
    //   form.setValue("amount", invoice.total)
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("invoice_id")])

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