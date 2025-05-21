"use server"
import { revalidatePath } from "next/cache";
import { ClientFormSchema } from '@/features/client/shared/schema/client.schema';
import { createClient } from '@/features/client/create/model/createClient';
import { fail, Result, success } from '@/shared/utils/result'

export async function createClientAction(formData: ClientFormSchema): Promise<Result<null>> {
  try {
    await createClient(formData);
    revalidatePath("/dashboard/clients")
    return success(null)
  } catch (error) {
    return fail((error as Error).message)
  }
} 