'use server';
import { revalidatePath } from 'next/cache';
import { ClientFormSchema } from '@/features/client/shared/schema/client.schema';
import { createClient } from '@/features/client/create/model/createClient';
import { Result } from '@/shared/utils/result';
import { withAction } from '@/shared/utils/withAction';
import { CLIENTS_PATH } from '@/shared/lib/routes';

export async function createClientAction(formData: ClientFormSchema): Promise<Result<null>> {
  return withAction(async () => {
    await createClient(formData);
    revalidatePath(CLIENTS_PATH);
    return null;
  });
}
