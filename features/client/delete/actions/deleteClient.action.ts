"use server"
import { revalidatePath } from "next/cache";
import { ClientActionResult } from '@/features/client/shared/types/client.types';
import { deleteClient } from '@/features/client/delete/model/deleteClient';

export async function deleteClientAction(clientId: string): Promise<ClientActionResult> {
  const { error } = await deleteClient(clientId);

  if (error) {
    return { error: error.message, success: false };
  }

  revalidatePath("/dashboard/clients");
  return { success: true };
} 