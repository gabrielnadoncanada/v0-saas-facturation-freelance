"use client"

import React from "react"

import { Invoice } from "@/shared/types/invoices/invoice"
import { useNewPaymentForm } from "./hooks/useNewPaymentForm"
import { NewPaymentFormView } from "./ui/NewPaymentFormView"

export function NewPaymentForm({ invoices }: { invoices: Invoice[] }) {
  const { isLoading, error, selectedInvoice, form, onSubmit, router } = useNewPaymentForm(invoices)

  return (
    <NewPaymentFormView
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
