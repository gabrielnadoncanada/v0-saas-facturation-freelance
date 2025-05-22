import React from "react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { createPaymentAction } from "@/features/payment/create/actions/createPayment.action"
import { Invoice } from "@/features/invoice/shared/types/invoice.types"
import { PaymentFormSchema } from "@/features/payment/shared/schema/payment.schema"
import { usePaymentForm } from "@/shared/hooks/usePaymentForm"


export function useNewPaymentForm(invoices: Invoice[]) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  const form = usePaymentForm()

  React.useEffect(() => {
    const invoice = invoices.find((inv) => inv.id === form.watch("invoice_id"))
    setSelectedInvoice(invoice || null)
    if (invoice && form.watch("amount") !== invoice.total) {
      form.setValue("amount", invoice.total)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("invoice_id")])

  const onSubmit = async (values: PaymentFormSchema) => {
    setIsLoading(true)
    setError(null)
    const result = await createPaymentAction(values)
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