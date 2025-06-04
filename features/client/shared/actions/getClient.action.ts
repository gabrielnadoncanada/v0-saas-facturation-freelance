'use server';
import { Client } from '@/features/client/shared/types/client.types';
import { getClient } from '@/features/client/shared/model/getClient';
import { Result } from '@/shared/utils/result';
import { withAction } from '@/shared/utils/withAction';

export async function getClientAction(clientId: string): Promise<Result<Client>> {
  return withAction(async () => {
    const client = await getClient(clientId);
    return client;
  });
}
