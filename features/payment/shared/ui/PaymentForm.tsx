'use client';

import { usePaymentForm } from '@/features/payment/shared/hooks/usePaymentForm';
import { PaymentFormView } from '@/features/payment/shared/ui/PaymentFormView';

interface PaymentFormProps {
  invoiceId: string;
  balanceDue: number;
  currency: string;
  onSuccess?: () => void;
}

export function PaymentForm(props: PaymentFormProps) {
  const form = usePaymentForm(props);
  return (
    <PaymentFormView
      formData={form.formData}
      balanceDue={props.balanceDue}
      currency={props.currency}
      isLoading={form.isLoading}
      error={form.error}
      handleChange={form.handleChange}
      handleSubmit={form.handleSubmit}
    />
  );
}

export default PaymentForm;
