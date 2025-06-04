'use client';

import { Payment } from '@/features/payment/shared/types/payment.types';
import { PaymentDetailsView } from '@/features/payment/view/ui/PaymentDetailsView';
import { usePaymentDetails } from '@/features/payment/view/hooks/usePaymentDetails';

export function PaymentDetails({ payment }: { payment: Payment }) {
  const { isDeleting, handleDelete, getPaymentMethodLabel } = usePaymentDetails(payment);

  return (
    <PaymentDetailsView
      payment={payment}
      isDeleting={isDeleting}
      onDelete={handleDelete}
      getPaymentMethodLabel={getPaymentMethodLabel}
    />
  );
}

export default PaymentDetails;
