import React from 'react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createPaymentAction } from '@/features/payment/create/actions/createPayment.action';
import { Invoice } from '@/features/invoice/shared/types/invoice.types';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  PaymentFormSchema,
  paymentFormSchema,
} from '@/features/payment/shared/schema/payment.schema';

function usePaymentForm(defaults: Partial<PaymentFormSchema> = {}) {
  return useForm<PaymentFormSchema>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      invoice_id: defaults.invoice_id || '',
      amount: defaults.amount ?? 0,
      payment_date: defaults.payment_date || new Date(),
      payment_method: defaults.payment_method || 'transfer',
      notes: defaults.notes || '',
    },
    mode: 'onBlur',
  });
}

export function useNewPaymentForm(invoices: Invoice[]) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const form = usePaymentForm();

  const invoiceId = useWatch({
    control: form.control,
    name: 'invoice_id',
  });

  React.useEffect(() => {
    const invoice = invoices.find((inv) => inv.id === invoiceId);
    setSelectedInvoice(invoice || null);
    if (invoice && form.watch('amount') !== invoice.total) {
      form.setValue('amount', invoice.total);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceId]);

  const onSubmit = async (values: PaymentFormSchema) => {
    setIsLoading(true);
    setError(null);
    const result = await createPaymentAction(values);
    if (result.success) {
      if (result.data.url) {
        window.location.href = result.data.url;
        return;
      }
      router.push('/dashboard/payments');
      router.refresh();
    } else {
      setError(result.error || 'Une erreur est survenue');
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    selectedInvoice,
    form,
    onSubmit,
    router,
  };
}
