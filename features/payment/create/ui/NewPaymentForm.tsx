'use client';

import React from 'react';

import { Invoice } from '@/features/invoice/shared/types/invoice.types';
import { useNewPaymentForm } from '@/features/payment/create/hooks/useNewPaymentForm';
import { NewPaymentFormView } from '@/features/payment/create/ui/NewPaymentFormView';

export function NewPaymentForm({ invoices }: { invoices: Invoice[] }) {
  const { isLoading, error, selectedInvoice, form, onSubmit, router } = useNewPaymentForm(invoices);

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
  );
}
