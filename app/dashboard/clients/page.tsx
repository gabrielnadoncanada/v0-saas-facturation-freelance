import { ClientsTable } from '@/features/client/list/ui/ClientsTable';
import { Button } from '@/components/ui/button';
import { getClientsAction } from '@/features/client/list/actions/getClients.action';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default async function ClientsPage() {
  const result = await getClientsAction();

  if (!result.success) {
    return <div>Error: {result.error}</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">Gérez vos clients et leurs informations</p>
        </div>
        <Link href="/dashboard/clients/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau client
          </Button>
        </Link>
      </div>

      <ClientsTable clients={result.data} />
    </div>
  );
}
