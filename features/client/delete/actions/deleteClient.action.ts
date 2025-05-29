"use server"
import { revalidatePath } from "next/cache";
import { CLIENTS_PATH } from '@/shared/lib/routes'
import { deleteClient } from '@/features/client/delete/model/deleteClient';
import { fail, Result, success } from "@/shared/utils/result";

export async function deleteClientAction(clientId: string): Promise<Result<void>> {
  try {
    await deleteClient(clientId);
    revalidatePath(CLIENTS_PATH);
    return success(undefined);
  } catch (error) {
    return fail((error as Error).message);
  }
} 