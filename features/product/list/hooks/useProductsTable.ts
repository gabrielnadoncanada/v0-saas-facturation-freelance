import { useState } from 'react';
import { deleteProductAction } from '@/features/product/shared/actions/deleteProduct.action';
import { useRouter } from 'next/navigation';

export function useProductsTable() {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const result = await deleteProductAction(id);
      if (!result.success) {
        console.error('Error deleting product:', result.error);
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
