import { useState } from 'react';
import { createPaymentAction } from '@/features/payment/create/actions/createPayment.action';
import { PaymentFormData } from '@/features/payment/shared/types/payment.types';

interface UsePaymentFormProps {
  invoiceId: string;
  balanceDue: number;
  currency: string;
  onSuccess?: () => void;
}

export function usePaymentForm({
  invoiceId,
  balanceDue,
  currency,
  onSuccess,
}: UsePaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    amount: balanceDue,
    payment_date: new Date(),
    payment_method: 'transfer',
    notes: '',
  });

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const payload: PaymentFormData = {
        invoice_id: invoiceId,
        amount: formData.amount,
        payment_date: formData.payment_date,
        payment_method: formData.payment_method,
        notes: formData.notes,
      };
      const result = await createPaymentAction(payload);

      if (result.success) {
        if (onSuccess) onSuccess();
      } else {
        setError(result.error || 'Une erreur est survenue');
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    error,
    handleChange,
    handleSubmit,
    setFormData,
  };
}
