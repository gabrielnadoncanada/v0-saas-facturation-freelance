"use server"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ClientFormData, ClientActionResult } from '@/features/client/shared/types/client.types';
import { createClient } from '@/features/client/create/model/createClient';

export async function createClientAction(data: ClientFormData): Promise<ClientActionResult> {
  const { error } = await createClient(data);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/clients");
  redirect("/dashboard/clients");
} 