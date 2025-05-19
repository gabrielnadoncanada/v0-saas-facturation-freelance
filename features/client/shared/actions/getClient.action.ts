"use server"
import { Client } from '@/features/client/shared/types/client.types';
import { getClient } from '@/features/client/shared/model/getClient';
import { fail, Result, success } from '@/shared/utils/result';

export async function getClientAction(clientId: string): Promise<Result<Client>> {
  try {
    const client = await getClient(clientId);
    return success(client);
  } catch (error) {
    return fail((error as Error).message);
  }
} 