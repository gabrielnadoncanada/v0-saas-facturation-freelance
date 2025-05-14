"use server"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ClientFormData, ClientActionResult } from '@/types/clients/client';
import { createClientInDb } from './createClientInDb';

export async function createClientAction(data: ClientFormData): Promise<ClientActionResult> {
  const { error } = await createClientInDb(data);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/clients");
  redirect("/dashboard/clients");
} 