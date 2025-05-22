"use client"

import { TeamMember } from '@/features/team/shared/types/team.types'
import { TeamMemberFormView } from '@/features/team/shared/ui/TeamMemberFormView'
import { useTeamMemberForm } from '@/features/team/shared/hooks/useTeamMemberForm'

export function TeamMemberForm({ member }: { member: TeamMember | null }) {
  const { form, onSubmit, isLoading, error } = useTeamMemberForm(member)

  return (
    <TeamMemberFormView
      form={form}
      onSubmit={onSubmit}
      isLoading={isLoading}
      error={error}
    />
  )
}
