"use server"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ClientFormData, ClientActionResult } from '@/features/client/shared/types/client.types';
import { updateClient } from '@/features/client/edit/model/updateClient';

export async function updateClientAction(clientId: string, data: ClientFormData): Promise<ClientActionResult> {
  const { error } = await updateClient(clientId, data);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/clients");
  redirect("/dashboard/clients");
} 