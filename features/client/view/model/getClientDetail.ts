import { Client } from '@/features/client/shared/types/client.types';
import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow';
import { getSessionUser } from '@/shared/utils/getSessionUser';

export async function getClientDetail(clientId: string): Promise<Client> {
  const { supabase, user } = await getSessionUser();

  const res = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", user.id)
    .eq("id", clientId)
    .single();

  return extractDataOrThrow<Client>(res);
} 