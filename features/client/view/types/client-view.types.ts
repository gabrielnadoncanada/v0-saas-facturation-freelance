import { Client } from '@/shared/lib/drizzle/types';
import { ClientStats } from '../model/getClientStats';

export interface ClientDetailData {
  client: Client;
  invoices: any[];
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
