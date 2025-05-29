"use server"
import { revalidatePath } from "next/cache";
import { CLIENTS_PATH } from '@/shared/lib/routes'
import { ClientFormSchema } from '@/features/client/shared/schema/client.schema';
import { createClient } from '@/features/client/create/model/createClient';
import { fail, Result, success } from '@/shared/utils/result'

export async function createClientAction(formData: ClientFormSchema): Promise<Result<null>> {
  try {
    await createClient(formData);
    revalidatePath(CLIENTS_PATH)
    return success(null)
  } catch (error) {
    return fail((error as Error).message)
  }
} 