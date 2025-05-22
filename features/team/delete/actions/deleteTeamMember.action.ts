"use server"

import { deleteTeamMember } from '@/features/team/delete/model/deleteTeamMember'
import { TeamMember } from '@/features/team/shared/types/team.types'
import { fail, Result, success } from '@/shared/utils/result'

export async function deleteTeamMemberAction(id: string): Promise<Result<TeamMember>> {
  try {
    const member = await deleteTeamMember(id)
    return success(member)
  } catch (error) {
    return fail((error as Error).message)
  }
}
