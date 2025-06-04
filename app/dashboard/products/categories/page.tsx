import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { CategoriesTable } from '@/features/category/list/ui/CategoriesTable';
import { getCategoriesAction } from '@/features/category/list/actions/getCategories.action';
import { redirect } from 'next/navigation';

export default async function CategoriesPage() {
  const result = await getCategoriesAction();

  if (!result.success) {
    redirect('/login');
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Catégories</h1>
          <p className="text-muted-foreground">
            Gérez les catégories pour organiser vos produits et services
          </p>
        </div>
        <Link href="/dashboard/products/categories/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle catégorie
          </Button>
        </Link>
      </div>

      <CategoriesTable categories={result.data} />
    </div>
  );
}
