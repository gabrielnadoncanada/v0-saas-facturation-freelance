import { Client } from '@/features/client/shared/types/client.types';
import { Invoice } from '@/features/invoice/shared/types/invoice.types';
import { ClientStats } from '../model/getClientStats';

export interface ClientDetailData {
  client: Client;
  invoices: Invoice[];
  stats: ClientStats;
}

export interface ClientInfoProps {
  client: Client;
}

export interface ClientStatsProps {
  stats: ClientStats;
  currency?: string;
}

export interface ClientInvoicesProps {
  invoices: Invoice[];
  currency?: string;
}
