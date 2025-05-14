import { extractDataOrThrow } from '@/shared/extractDataOrThrow';
import { getSessionUser } from '@/shared/getSessionUser';
import { Client } from '@/types/clients/client';

export async function fetchAllClients(): Promise<Client[]> {
  const { supabase, user } = await getSessionUser()

  const res = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", user.id)
    .order("name", { ascending: true });

    return extractDataOrThrow<Client[]>(res)
} 