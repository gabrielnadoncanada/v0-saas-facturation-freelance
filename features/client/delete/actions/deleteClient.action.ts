'use server';
import { revalidatePath } from 'next/cache';
import { ClientQueries } from '@/shared/lib/drizzle/queries/ClientQueries';
import { Result } from '@/shared/utils/result';
import { withAction } from '@/shared/utils/withAction';
import { CLIENTS_PATH } from '@/shared/lib/routes';

export async function deleteClientAction(clientId: string): Promise<Result<void>> {
  return withAction(async () => {
    await ClientQueries.delete(clientId);
    revalidatePath(CLIENTS_PATH);
    return undefined;
  });
}
