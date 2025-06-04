import { useState } from 'react';
import { deleteClientAction } from '@/features/client/delete/actions/deleteClient.action';
import { useRouter } from 'next/navigation';

export function useClientsTable() {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const result = await deleteClientAction(id);
      if (!result.success) {
        console.error('Error deleting client:', result.error);
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    handleDelete,
    router,
  };
}
