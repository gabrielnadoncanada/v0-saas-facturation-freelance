import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteInvoiceAction } from '@/features/invoice/delete/actions/deleteInvoice.action';

export function useInvoicesTable() {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const result = await deleteInvoiceAction(id);
      if (!result.success) {
        console.error('Error deleting invoice:', result.error);
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Brouillon';
      case 'sent':
        return 'Envoyée';
      case 'paid':
        return 'Payée';
      case 'overdue':
        return 'En retard';
      default:
        return status;
    }
  };

  return {
    isDeleting,
    handleDelete,
    getStatusLabel,
    router,
  };
}
