import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PaymentFormSchema, paymentFormSchema } from "@/features/payment/shared/schema/payment.schema"

export function usePaymentForm(defaults: Partial<PaymentFormSchema> = {}) {
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
