'use server';

import { Client } from '@/features/client/shared/types/client.types';
import { getClients } from '@/features/client/list/model/getClients';
import { Result } from '@/shared/utils/result';
import { withAction } from '@/shared/utils/withAction';

export async function getClientsAction(): Promise<Result<Client[]>> {
  return withAction(async () => {
    const clients = await getClients();
    return clients;
  });
}
