import { getClientDetail } from '@/features/client/view/model/getClientDetail';
import { getClientInvoices } from '@/features/client/view/model/getClientInvoices';
import { calculateClientStats } from '@/features/client/view/model/getClientStats';
import { ClientDetailData } from '@/features/client/view/types/client-view.types';

export async function getClientDetailAction(clientId: string): Promise<ClientDetailData> {
  const client = await getClientDetail(clientId);
  const invoices = await getClientInvoices(clientId);
  const stats = calculateClientStats(invoices);
  return { client, invoices, stats };
} 