"use server"

import { getTeamMembers } from '@/features/team/shared/model/getTeamMembers'
import { TeamMember } from '@/features/team/shared/types/team.types'
import { fail, Result, success } from '@/shared/utils/result'

export async function getTeamMembersAction(): Promise<Result<TeamMember[]>> {
  try {
    const members = await getTeamMembers()
    return success(members)
  } catch (error) {
    return fail((error as Error).message)
  }
}
