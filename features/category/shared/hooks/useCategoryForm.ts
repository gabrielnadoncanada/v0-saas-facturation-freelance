import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createCategoryAction } from '@/features/category/create/actions/createCategory.action';
import { updateCategoryAction } from '@/features/category/edit/actions/updateCategory.action';
import {
  Category,
  CategoryFormData,
  CategoryActionResult,
} from '@/features/category/shared/types/category.types';

const categoryFormSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
  color: z.string().min(1, 'La couleur est requise'),
});

export function useCategoryForm({
  category,
  isModal = false,
  onSuccess,
}: {
  category?: Category;
  isModal?: boolean;
  onSuccess?: (categoryId: string | null) => void;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
      color: category?.color || '#f87171',
    },
    mode: 'onBlur',
  });

  // Attach onSubmit handler to form
  const onSubmit = async (data: CategoryFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const result: CategoryActionResult =
        category && updateCategoryAction
          ? await updateCategoryAction(category.id, data)
          : await createCategoryAction(data);

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      setIsLoading(false);

      if (isModal) {
        setSuccess('Catégorie créée avec succès!');
        form.reset({ name: '', description: '', color: '#f87171' });
        setTimeout(() => {
          if (onSuccess) {
            onSuccess(result.data && !Array.isArray(result.data) ? result.data.id : null);
          }
        }, 500);
      } else if (onSuccess) {
        onSuccess(result.data && !Array.isArray(result.data) ? result.data.id : null);
      } else {
        router.push('/dashboard/products/categories');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur inattendue est survenue');
      setIsLoading(false);
    }
  };

  // Attach onSubmit to form for UI
  (form as any).onSubmit = onSubmit;

  return {
    form,
    isLoading,
    error,
    success,
    category,
  };
}
