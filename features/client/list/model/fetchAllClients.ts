import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow';
import { getSessionUser } from '@/shared/utils/getSessionUser';
import { Client } from '@/shared/types/clients/client';

export async function fetchAllClients(): Promise<Client[]> {
  const { supabase, user } = await getSessionUser()

  const res = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", user.id)
    .order("name", { ascending: true });

    return extractDataOrThrow<Client[]>(res)
} 