"use server"
import { Client, ClientActionResult } from '@/types/clients/client';
import { fetchClientById } from './fetchClientById';

export async function getClientAction(clientId: string): Promise<Client> {
  return fetchClientById(clientId);
} 