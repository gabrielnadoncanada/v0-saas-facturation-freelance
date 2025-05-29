"use server"
import { revalidatePath } from "next/cache";
import { ClientFormData } from '@/features/client/shared/types/client.types';
import { updateClient } from '@/features/client/edit/model/updateClient';
import { Result } from "@/shared/utils/result";
import { withAction } from "@/shared/utils/withAction";
import { CLIENTS_PATH } from "@/shared/lib/routes";
export async function updateClientAction(clientId: string, data: ClientFormData): Promise<Result<null>> {
  return withAction(async () => {
    await updateClient(clientId, data);
    revalidatePath(CLIENTS_PATH)
    return null;
  })
}
