'use client';

import { useCategoryTableActions } from '@/features/category/list/hooks/useCategoryTableActions';
import { CategoriesTableView } from '@/features/category/list/ui/CategoriesTableView';
import { CategoryDeleteDialog } from '@/features/category/list/ui/CategoryDeleteDialog';

interface CategoriesTableProps {
  categories: any[];
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
  const { deleteId, setDeleteId, isDeleting, handleDelete } = useCategoryTableActions();

  return (
    <>
      <CategoriesTableView categories={categories} setDeleteId={setDeleteId} />
      <CategoryDeleteDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
