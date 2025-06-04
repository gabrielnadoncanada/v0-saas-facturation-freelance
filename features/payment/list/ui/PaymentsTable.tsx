'use client';

import { usePaymentsTable } from '@/features/payment/list/hooks/usePaymentsTable';
import { Payment } from '@/features/payment/shared/types/payment.types';
import { DataTable } from '@/components/ui/data-table';
import { Eye, Edit, Trash, Package } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/shared/lib/utils';

export function PaymentsTable({ payments }: { payments: Payment[] }) {
  const {
    searchTerm,
    setSearchTerm,
    deleteDialogOpen,
    setDeleteDialogOpen,
    paymentToDelete,
    setPaymentToDelete,
    isDeleting,
    filteredPayments,
    handleDelete,
    getPaymentMethodLabel,
    router,
  } = usePaymentsTable(payments);

  const columns = [
    {
      header: 'Facture',
      accessorKey: 'invoice' as keyof Payment,
      cell: (payment: Payment) => payment.invoice.invoice_number,
      className: 'font-medium',
    },
    {
      header: 'Client',
      accessorKey: 'client_name' as keyof Payment,
    },
    {
      header: 'Date',
      accessorKey: 'payment_date' as keyof Payment,
      cell: (payment: Payment) => formatDate(payment.payment_date as string),
    },
    {
      header: 'Montant',
      accessorKey: 'amount' as keyof Payment,
      cell: (payment: Payment) => formatCurrency(payment.amount, payment.invoice.currency),
    },
    {
      header: 'Méthode',
      accessorKey: 'payment_method' as keyof Payment,
      cell: (payment: Payment) => getPaymentMethodLabel(payment.payment_method),
    },
  ];

  const actions = [
    {
      label: 'Voir les détails',
      icon: <Eye className="h-4 w-4" />,
      onClick: (payment: Payment) => router.push(`/dashboard/payments/${payment.id}`),
    },
    {
      label: 'Modifier',
      icon: <Edit className="h-4 w-4" />,
      onClick: (payment: Payment) => router.push(`/dashboard/payments/${payment.id}/edit`),
    },
    {
      label: 'Supprimer',
      icon: <Trash className="h-4 w-4" />,
      className: 'text-red-600',
      onClick: (payment: Payment) => {
        setPaymentToDelete(payment.id);
        setDeleteDialogOpen(true);
      },
    },
  ];

  const emptyState = (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <Package className="h-10 w-10 text-primary" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">Aucun paiement</h3>
      <p className="mb-4 mt-2 text-sm text-muted-foreground">
        Vous n'avez pas encore ajouté de paiements.
      </p>
      <Link href="/dashboard/payments/new">
        <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
          Ajouter un paiement
        </button>
      </Link>
    </div>
  );

  return (
    <DataTable
      data={payments}
      columns={columns}
      actions={actions}
      searchPlaceholder="Rechercher des paiements..."
      searchFields={['invoice.invoice_number', 'invoice.client.name', 'payment_method']}
      emptyState={emptyState}
      onRowClick={(payment) => router.push(`/dashboard/payments/${payment.id}`)}
      deleteAction={{
        title: 'Êtes-vous sûr?',
        description:
          'Cette action ne peut pas être annulée. Cela supprimera définitivement ce paiement.',
        onDelete: handleDelete,
        isDeleting: isDeleting,
      }}
    />
  );
}
