"use server"

import { updateTeamMember } from '@/features/team/edit/model/updateTeamMember'
import { TeamMember, TeamMemberFormData } from '@/features/team/shared/types/team.types'
import { fail, Result, success } from '@/shared/utils/result'

export async function updateTeamMemberAction(id: string, data: TeamMemberFormData): Promise<Result<TeamMember>> {
  try {
    const member = await updateTeamMember(id, data)
    return success(member)
  } catch (error) {
    return fail((error as Error).message)
  }
}
