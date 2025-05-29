import { useCallback, useEffect, useState } from 'react';
import { getClientDetail } from '../model/getClientDetail';
import { getClientInvoices } from '../model/getClientInvoices';
import { ClientStats, calculateClientStats } from '../model/getClientStats';
import { Client } from '@/features/client/shared/types/client.types';
import { Invoice } from '@/features/invoice/shared/types/invoice.types';
import { toast } from 'sonner';

export function useClientDetail(clientId: string) {
  const [client, setClient] = useState<Client | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
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
      // Récupérer les détails du client
      const clientData = await getClientDetail(clientId);
      setClient(clientData);

      // Récupérer les factures du client
      const invoicesData = await getClientInvoices(clientId);
      setInvoices(invoicesData);

      // Calculer les statistiques du client
      const clientStats = calculateClientStats(invoicesData);
      setStats(clientStats);
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
    refetch: fetchClientData
  };
} 