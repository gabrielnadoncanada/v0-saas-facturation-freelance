import { getSessionUser } from '@/shared/utils/getSessionUser'
import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow'
import { TeamMember } from '@/features/team/shared/types/team.types'

export async function getTeamMember(id: string): Promise<TeamMember> {
  const { supabase, user } = await getSessionUser()

  const res = await supabase
    .from('team_members')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  return extractDataOrThrow<TeamMember>(res)
}
