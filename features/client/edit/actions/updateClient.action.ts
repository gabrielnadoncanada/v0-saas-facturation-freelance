"use server"
import { revalidatePath } from "next/cache";
import { ClientFormData } from '@/features/client/shared/types/client.types';
import { updateClient } from '@/features/client/edit/model/updateClient';
import { fail, Result, success } from "@/shared/utils/result";

export async function updateClientAction(clientId: string, data: ClientFormData): Promise<Result<null>> {
  try {
    await updateClient(clientId, data);
    revalidatePath("/dashboard/clients");
    return success(null);
  } catch (error) {
    return fail((error as Error).message);
  }
} 
