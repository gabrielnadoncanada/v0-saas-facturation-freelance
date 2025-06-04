import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInvoiceStatus } from '@/features/invoice/shared/hooks/useInvoiceStatus';
import { updateInvoiceStatusAction } from '@/features/invoice/shared/actions/updateInvoiceStatus.action';

export function useInvoiceDetails(invoiceId: string) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { getStatusLabel } = useInvoiceStatus();

  const updateInvoiceStatus = (status: string) => {
    setError(null);
    startTransition(async () => {
      const res = await updateInvoiceStatusAction(invoiceId, status);
      if (!res.success) {
        setError(res.error || 'Une erreur est survenue');
        return;
      }
      router.refresh();
    });
  };

  return {
    isLoading: isPending,
    error,
    setError,
    paymentDialogOpen,
    setPaymentDialogOpen,
    updateInvoiceStatus,
    getStatusLabel,
  };
}
