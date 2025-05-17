"use client"

import React from "react"

import { Payment } from "@/shared/types/payments/payment"
import { Invoice } from "@/shared/types/invoices/invoice"
import { useEditPaymentForm } from "./hooks/useEditPaymentForm"
import { EditPaymentFormView } from "./ui/EditPaymentFormView"

export function EditPaymentForm({ payment, invoices }: { payment: Payment, invoices: Invoice[] }) {
  const { isLoading, error, selectedInvoice, form, onSubmit, router } = useEditPaymentForm(payment, invoices)

  return (
    <EditPaymentFormView
      form={form}
      isLoading={isLoading}
      error={error}
      selectedInvoice={selectedInvoice}
      invoices={invoices}
      onCancel={() => router.back()}
      onSubmit={onSubmit}
    />
  )
}
