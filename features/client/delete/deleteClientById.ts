import { getSessionUser } from '@/shared/getSessionUser';

export async function deleteClientById(clientId: string) {
  const { supabase, user } = await getSessionUser()

  return await supabase.from("clients").delete().eq("id", clientId).eq("user_id", user.id);
} 