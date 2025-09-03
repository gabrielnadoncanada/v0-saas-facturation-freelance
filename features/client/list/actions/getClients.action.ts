'use server';

import { Client } from '@/shared/lib/drizzle/types';
import { ClientQueries } from '@/shared/lib/drizzle/queries/ClientQueries';
import { Result } from '@/shared/utils/result';
import { withAction } from '@/shared/utils/withAction';

export async function getClientsAction(): Promise<Result<Client[]>> {
  return withAction(async () => {
    const clients = await ClientQueries.getAll();
    return clients;
  });
}
