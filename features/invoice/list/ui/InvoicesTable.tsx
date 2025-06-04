'use client';

import { useInvoicesTable } from '@/features/invoice/list/hooks/useInvoicesTable';
import { Invoice } from '@/features/invoice/shared/types/invoice.types';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash, Download, Package } from 'lucide-react';
import { formatCurrency, formatDate, getInvoiceStatusColor } from '@/shared/lib/utils';
import Link from 'next/link';
export function InvoicesTable({ invoices }: { invoices: Invoice[] }) {
  const { isDeleting, handleDelete, getStatusLabel, router } = useInvoicesTable();

  const columns = [
    {
      header: 'Numéro',
      accessorKey: 'invoice_number' as keyof Invoice,
      className: 'font-medium',
    },
    {
      header: 'Client',
      accessorKey: 'client' as keyof Invoice,
      cell: (invoice: Invoice) => invoice.client.name,
    },
    {
      header: 'Date',
      accessorKey: 'issue_date' as keyof Invoice,
      cell: (invoice: Invoice) => formatDate(invoice.issue_date as string),
    },
    {
      header: 'Échéance',
      accessorKey: 'due_date' as keyof Invoice,
      cell: (invoice: Invoice) => formatDate(invoice.due_date as string),
    },
    {
      header: 'Montant',
      accessorKey: 'total' as keyof Invoice,
      cell: (invoice: Invoice) => formatCurrency(invoice.total, invoice.currency),
    },
    {
      header: 'Statut',
      accessorKey: 'status' as keyof Invoice,
      cell: (invoice: Invoice) => (
        <Badge className={getInvoiceStatusColor(invoice.status)}>
          {getStatusLabel(invoice.status)}
        </Badge>
      ),
    },
  ];

  const actions = [
    {
      label: 'Voir',
      icon: <Eye className="h-4 w-4" />,
      onClick: (invoice: Invoice) => router.push(`/dashboard/invoices/${invoice.id}`),
    },
    {
      label: 'Modifier',
      icon: <Edit className="h-4 w-4" />,
      onClick: (invoice: Invoice) => router.push(`/dashboard/invoices/${invoice.id}/edit`),
    },
    {
      label: 'Télécharger PDF',
      icon: <Download className="h-4 w-4" />,
      onClick: (invoice: Invoice) => {
        window.open(`/api/invoices/${invoice.id}/pdf`, '_blank');
      },
    },
    {
      label: 'Supprimer',
      icon: <Trash className="h-4 w-4" />,
      className: 'text-red-600',
    },
  ];

  const emptyState = (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <Package className="h-10 w-10 text-primary" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">Aucune facture</h3>
      <p className="mb-4 mt-2 text-sm text-muted-foreground">
        Vous n'avez pas encore ajouté de factures.
      </p>
      <Link href="/dashboard/invoices/new">
        <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
          Ajouter une facture
        </button>
      </Link>
    </div>
  );

  return (
    <DataTable
      data={invoices}
      columns={columns}
      actions={actions}
      searchPlaceholder="Rechercher des factures..."
      searchFields={['invoice_number', 'client.name']}
      emptyState={emptyState}
      onRowClick={(invoice) => router.push(`/dashboard/invoices/${invoice.id}`)}
      deleteAction={{
        title: 'Êtes-vous sûr?',
        description:
          'Cette action ne peut pas être annulée. Cela supprimera définitivement la facture et toutes les données associées.',
        onDelete: handleDelete,
        isDeleting: isDeleting,
      }}
    />
  );
}
