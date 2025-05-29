"use server"
import { revalidatePath } from "next/cache";
import { deleteClient } from '@/features/client/delete/model/deleteClient';
import { Result } from "@/shared/utils/result";
import { withAction } from "@/shared/utils/withAction";

export async function deleteClientAction(clientId: string): Promise<Result<void>> {
  return withAction(async () => {
    await deleteClient(clientId);
    return undefined;
  }, { revalidatePath: '/dashboard/clients' });
}
