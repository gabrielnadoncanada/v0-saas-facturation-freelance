"use client"

import { TeamMember } from '@/features/team/shared/types/team.types'
import { useTeamMembersTable } from '@/features/team/list/hooks/useTeamMembersTable'
import { TeamMembersTableView } from '@/features/team/list/ui/TeamMembersTableView'

export function TeamMembersTable({ members }: { members: TeamMember[] }) {
  const props = useTeamMembersTable(members)
  return <TeamMembersTableView {...props} />
}
