'use client';

import React from 'react';

import { Payment } from '@/features/payment/shared/types/payment.types';
import { Invoice } from '@/features/invoice/shared/types/invoice.types';
import { useEditPaymentForm } from '@/features/payment/edit/hooks/useEditPaymentForm';
import { EditPaymentFormView } from '@/features/payment/edit/ui/EditPaymentFormView';

export function EditPaymentForm({ payment, invoices }: { payment: Payment; invoices: Invoice[] }) {
  const { isLoading, error, selectedInvoice, form, onSubmit, router } = useEditPaymentForm(
    payment,
    invoices,
  );

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
  );
}
