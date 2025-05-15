"use server"

import { Client } from '@/shared/types/clients/client'
import { fetchAllClients } from './fetchAllClients'

export async function getAllClientsAction(): Promise<Client[]> {
  return fetchAllClients()
}
