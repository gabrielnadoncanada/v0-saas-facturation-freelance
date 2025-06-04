'use server';

import { revalidatePath } from 'next/cache';
import { Client, ClientFormData } from '@/features/client/shared/types/client.types';
import { createClient } from '@/features/client/create/model/createClient';
import { Result } from '@/shared/utils/result';
import { withAction } from '@/shared/utils/withAction';
import { CLIENTS_PATH } from '@/shared/lib/routes';

export async function createClientInlineAction(data: ClientFormData): Promise<Result<Client>> {
  return withAction(async () => {
    const client = await createClient(data);
    revalidatePath(CLIENTS_PATH);
    return client as Client;
  });
}
