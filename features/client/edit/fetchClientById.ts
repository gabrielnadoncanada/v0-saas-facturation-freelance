import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow';
import { getSessionUser } from '@/shared/utils/getSessionUser';
import { Client } from '@/shared/types/clients/client';

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