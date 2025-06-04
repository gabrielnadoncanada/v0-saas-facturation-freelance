'use client';

import { useClientsTable } from '@/features/client/list/hooks/useClientsTable';
import { Client } from '@/features/client/shared/types/client.types';
import { DataTable } from '@/components/ui/data-table';
import { Edit, Package, Trash, FileText, Eye } from 'lucide-react';
import Link from 'next/link';

export function ClientsTable({ clients }: { clients: Client[] }) {
  const { handleDelete, router, isDeleting } = useClientsTable();

  const columns = [
    {
      header: 'Nom',
      accessorKey: 'name' as keyof Client,
      className: 'font-medium',
    },
    {
      header: 'Email',
      accessorKey: 'email' as keyof Client,
    },
    {
      header: 'Téléphone',
      accessorKey: 'phone' as keyof Client,
    },
  ];

  const actions = [
    {
      label: 'Voir',
      icon: <Eye className="h-4 w-4" />,
      onClick: (client: Client) => router.push(`/dashboard/clients/${client.id}`),
    },
    {
      label: 'Modifier',
      icon: <Edit className="h-4 w-4" />,
      onClick: (client: Client) => router.push(`/dashboard/clients/${client.id}`),
    },
    {
      label: 'Factures',
      icon: <FileText className="h-4 w-4" />,
      onClick: (client: Client) => router.push(`/dashboard/clients/${client.id}`),
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
      <h3 className="mt-4 text-lg font-semibold">Aucun client</h3>
      <p className="mb-4 mt-2 text-sm text-muted-foreground">
        Vous n'avez pas encore ajouté de clients.
      </p>
      <Link href="/dashboard/clients/new">
        <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
          Ajouter un client
        </button>
      </Link>
    </div>
  );

  return (
    <DataTable
      data={clients}
      columns={columns}
      actions={actions}
      searchPlaceholder="Rechercher des clients..."
      searchFields={['name', 'email', 'phone']}
      onRowClick={(client: Client) => router.push(`/dashboard/clients/${client.id}`)}
      emptyState={emptyState}
      deleteAction={{
        title: 'Êtes-vous sûr?',
        description:
          'Cette action ne peut pas être annulée. Cela supprimera définitivement le client et toutes les données associées.',
        onDelete: handleDelete,
        isDeleting: isDeleting,
      }}
    />
  );
}
