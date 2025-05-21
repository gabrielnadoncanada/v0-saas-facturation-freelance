"use server"

import { revalidatePath } from "next/cache"
import { Client, ClientFormData } from "@/features/client/shared/types/client.types"
import { createClient } from "@/features/client/create/model/createClient"
import { Result, fail, success } from "@/shared/utils/result"

export async function createClientInlineAction(data: ClientFormData): Promise<Result<Client>> {
  try {
    const client = await createClient(data)
    revalidatePath("/dashboard/clients")
    return success(client as Client)
  } catch (error) {
    return fail((error as Error).message)
  }
}
