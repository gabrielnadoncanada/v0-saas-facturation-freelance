"use server"

import { createTeamMember } from '@/features/team/create/model/createTeamMember'
import { TeamMember, TeamMemberFormData } from '@/features/team/shared/types/team.types'
import { fail, Result, success } from '@/shared/utils/result'

export async function createTeamMemberAction(data: TeamMemberFormData): Promise<Result<TeamMember>> {
  try {
    const member = await createTeamMember(data)
    return success(member)
  } catch (error) {
    return fail((error as Error).message)
  }
}
