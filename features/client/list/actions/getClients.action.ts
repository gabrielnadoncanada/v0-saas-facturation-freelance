"use server"

import { Client } from '@/features/client/shared/types/client.types'
import { getClients } from '@/features/client/list/model/getClients'
import { fail, Result, success } from '@/shared/utils/result'

export async function getClientsAction(): Promise<Result<Client[]>> {
  try {
    const clients = await getClients()
    return success(clients)
  } catch (error) {
    return fail((error as Error).message)
  }
}
