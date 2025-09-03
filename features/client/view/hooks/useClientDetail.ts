import { useCallback, useEffect, useState } from 'react';
import { getClientDetailAction } from '../actions/getClientDetail.action';
import { Client } from '@/shared/lib/drizzle/types';
import { toast } from 'sonner';

export function useClientDetail(clientId: string) {
  const [client, setClient] = useState<Client | null>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [stats, setStats] = useState<ClientStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClientData = useCallback(async () => {
    if (!clientId) {
      setError('ID client non valide');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Récupérer toutes les données du client via l'action
      const result = await getClientDetailAction(clientId);

      if (result.success) {
        const { client, invoices, stats } = result.data;
        setClient(client);
        setInvoices(invoices);
        setStats(stats);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des données client:', err);
      setError('Impossible de charger les données client. Veuillez réessayer.');
      toast.error('Erreur lors du chargement des données client');
    } finally {
      setIsLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchClientData();
  }, [fetchClientData]);

  return {
    client,
    invoices,
    stats,
    isLoading,
    error,
    refetch: fetchClientData,
  };
}
