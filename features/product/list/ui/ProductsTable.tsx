'use client';

import { useProductsTable } from '@/features/product/list/hooks/useProductsTable';
import { Product } from '@/features/product/shared/types/product.types';
import { DataTable } from '@/components/ui/data-table';
import { Package, Pencil, Trash2, Tag } from 'lucide-react';
import { formatCurrency } from '@/shared/lib/utils';
import Link from 'next/link';

export function ProductsTable({ products }: { products: Product[] }) {
  const { isDeleting, handleDelete, router } = useProductsTable();

  const columns = [
    {
      header: 'Nom',
      accessorKey: 'name' as keyof Product,
      className: 'font-medium',
    },
    {
      header: 'Type',
      accessorKey: 'is_service' as keyof Product,
      cell: (product: Product) =>
        product.is_service ? (
          <span className="flex items-center text-blue-600">
            <Tag className="mr-1 h-4 w-4" />
            Service
          </span>
        ) : (
          <span className="flex items-center text-green-600">
            <Package className="mr-1 h-4 w-4" />
            Produit
          </span>
        ),
    },
    {
      header: 'Catégorie',
      accessorKey: 'category' as keyof Product,
      hide: 'mobile' as const,
      cell: (product: Product) =>
        'category' in product && product.category ? (
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: (product.category as any).color || '#94a3b8' }}
            />
            <span>{(product.category as any).name}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      header: 'Prix',
      accessorKey: 'price' as keyof Product,
      className: 'text-right',
      cell: (product: Product) => formatCurrency(product.price),
    },
    {
      header: 'TVA',
      accessorKey: 'tax_rate' as keyof Product,
      className: 'text-right',
      cell: (product: Product) => `${product.tax_rate}%`,
    },
  ];

  const actions = [
    {
      label: 'Modifier',
      icon: <Pencil className="h-4 w-4" />,
      onClick: (product: Product) => router.push(`/dashboard/products/${product.id}/edit`),
    },
    {
      label: 'Supprimer',
      icon: <Trash2 className="h-4 w-4" />,
      className: 'text-destructive focus:text-destructive',
    },
  ];

  const emptyState = (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <Package className="h-10 w-10 text-primary" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">Aucun produit</h3>
      <p className="mb-4 mt-2 text-sm text-muted-foreground">
        Vous n'avez pas encore ajouté de produits ou services à votre catalogue.
      </p>
      <Link href="/dashboard/products/new">
        <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
          Ajouter un produit
        </button>
      </Link>
    </div>
  );

  return (
    <DataTable
      data={products}
      columns={columns}
      actions={actions}
      searchFields={['name']}
      emptyState={emptyState}
      onRowClick={(product: Product) => router.push(`/dashboard/products/${product.id}/edit`)}
      deleteAction={{
        title: 'Êtes-vous sûr de vouloir supprimer ce produit ?',
        description:
          'Cette action est irréversible. Le produit sera définitivement supprimé de votre catalogue.',
        onDelete: handleDelete,
        isDeleting: isDeleting,
      }}
    />
  );
}
