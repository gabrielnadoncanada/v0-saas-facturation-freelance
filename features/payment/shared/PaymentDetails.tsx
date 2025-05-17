"use client"

import { Payment } from "@/shared/types/payments/payment"
import { PaymentDetailsView } from "./ui/PaymentDetailsView"
import { usePaymentDetails } from "./hooks/usePaymentDetails"

export interface PaymentDetailsProps {
  payment: Payment
}

export function PaymentDetails({ payment }: PaymentDetailsProps) {
  const { isDeleting, handleDelete, getPaymentMethodLabel } = usePaymentDetails(payment)

  return (
    <PaymentDetailsView
      payment={payment}
      isDeleting={isDeleting}
      onDelete={handleDelete}
      getPaymentMethodLabel={getPaymentMethodLabel}
    />
  )
}

export default PaymentDetails;
