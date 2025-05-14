"use server"
import { revalidatePath } from "next/cache";
import { ClientActionResult } from '@/types/clients/client';
import { deleteClientById } from './deleteClientById';

export async function deleteClientAction(clientId: string): Promise<ClientActionResult> {
  const { error } = await deleteClientById(clientId);

  if (error) {
    return { error: error.message, success: false };
  }

  revalidatePath("/dashboard/clients");
  return { success: true };
} 