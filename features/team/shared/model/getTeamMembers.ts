import { getSessionUser } from '@/shared/utils/getSessionUser'
import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow'
import { TeamMember } from '@/features/team/shared/types/team.types'

export async function getTeamMembers(): Promise<TeamMember[]> {
  const { supabase, user } = await getSessionUser()

  const res = await supabase
    .from('team_members')
    .select('*')
    .eq('user_id', user.id)
    .order('name', { ascending: true })

  return extractDataOrThrow<TeamMember[]>(res)
}
