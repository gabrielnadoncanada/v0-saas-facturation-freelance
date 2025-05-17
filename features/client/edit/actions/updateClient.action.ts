"use server"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ClientFormData, ClientActionResult } from '@/shared/types/clients/client';
import { updateClientInDb } from '@/features/client/edit/model/updateClientInDb';

export async function updateClientAction(clientId: string, data: ClientFormData): Promise<ClientActionResult> {
  const { error } = await updateClientInDb(clientId, data);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/clients");
  redirect("/dashboard/clients");
} 