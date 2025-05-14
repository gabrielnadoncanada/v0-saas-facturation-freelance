import { extractDataOrThrow } from '@/shared/extractDataOrThrow';
import { getSessionUser } from '@/shared/getSessionUser';
import { Client } from '@/types/clients/client';

export async function fetchClientById(clientId: string) {
  const { supabase, user } = await getSessionUser()

  const res = await supabase
    .from("clients")
    .select("*")
    .eq("id", clientId)
    .eq("user_id", user.id)
    .single();

  return extractDataOrThrow<Client>(res)
} 