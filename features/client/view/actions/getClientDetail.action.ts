'use server';
import { ClientQueries } from '@/shared/lib/drizzle/queries/ClientQueries';
import { InvoiceQueries } from '@/shared/lib/drizzle/queries/InvoiceQueries';
import { ClientDetailData } from '@/features/client/view/types/client-view.types';
import { Result } from '@/shared/utils/result';
import { withAction } from '@/shared/utils/withAction';

export async function getClientDetailAction(clientId: string): Promise<Result<ClientDetailData>> {
  return withAction(async () => {
    const [client, invoices, stats] = await Promise.all([
      ClientQueries.getById(clientId),
      InvoiceQueries.getByClientId(clientId),
      ClientQueries.getStats(clientId),
    ]);

    return { client, invoices, stats };
  });
}
