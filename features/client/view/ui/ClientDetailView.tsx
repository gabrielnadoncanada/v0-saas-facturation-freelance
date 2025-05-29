import { ClientInfoView } from './ClientInfoView';
import { ClientStatsView } from './ClientStatsView';
import { ClientInvoicesView } from './ClientInvoicesView';
import { ClientDetailData } from '../types/client-view.types';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ClientDetailViewProps {
  data: ClientDetailData | null;
  isLoading: boolean;
  error: string | null;
}

export function ClientDetailView({ data, isLoading, error }: ClientDetailViewProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!data || !data.client) {
    return (
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Client non trouvé</AlertTitle>
        <AlertDescription>
          Impossible de trouver les détails du client demandé.
        </AlertDescription>
      </Alert>
    );
  }

  // Utiliser la devise par défaut (€) car le Client n'a pas de propriété currency
  const defaultCurrency = 'EUR';

  return (
    <div className="space-y-6">
      <ClientInfoView client={data.client} />
      <ClientStatsView stats={data.stats} currency={defaultCurrency} />
      <ClientInvoicesView invoices={data.invoices} currency={defaultCurrency} />
    </div>
  );
} 