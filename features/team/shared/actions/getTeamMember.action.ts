"use server"

import { getTeamMember } from '@/features/team/shared/model/getTeamMember'
import { TeamMember } from '@/features/team/shared/types/team.types'
import { fail, Result, success } from '@/shared/utils/result'

export async function getTeamMemberAction(id: string): Promise<Result<TeamMember>> {
  try {
    const member = await getTeamMember(id)
    return success(member)
  } catch (error) {
    return fail((error as Error).message)
  }
}
