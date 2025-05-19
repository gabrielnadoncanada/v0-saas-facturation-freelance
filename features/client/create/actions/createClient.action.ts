"use server"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Client, ClientFormData } from '@/features/client/shared/types/client.types';
import { createClient } from '@/features/client/create/model/createClient';
import { fail, Result, success } from '@/shared/utils/result'

export async function createClientAction(data: ClientFormData): Promise<Result<Client>> {
  try {
    const client = await createClient(data);

    revalidatePath("/dashboard/clients")
    redirect("/dashboard/clients")
  } catch (error) {
    return fail((error as Error).message)
  }
} 