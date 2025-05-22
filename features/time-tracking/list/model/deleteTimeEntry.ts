import { getSessionUser } from '@/shared/utils/getSessionUser'

export async function deleteTimeEntry(entryId: string): Promise<void> {
  const { supabase, user } = await getSessionUser()
  const { error } = await supabase
    .from('time_entries')
    .delete()
    .eq('id', entryId)
    .eq('user_id', user.id)
  if (error) {
    throw new Error(error.message)
  }
}
