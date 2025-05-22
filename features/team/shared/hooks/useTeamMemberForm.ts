import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TeamMember } from '@/features/team/shared/types/team.types'
import { teamMemberFormSchema, TeamMemberFormSchema } from '@/features/team/shared/schema/teamMember.schema'
import { createTeamMemberAction } from '@/features/team/create/actions/createTeamMember.action'
import { updateTeamMemberAction } from '@/features/team/edit/actions/updateTeamMember.action'

export function useTeamMemberForm(member: TeamMember | null) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<TeamMemberFormSchema>({
    resolver: zodResolver(teamMemberFormSchema),
    defaultValues: {
      name: member?.name || '',
      email: member?.email || '',
      role: member?.role || '',
    },
  })

  const onSubmit = async (values: TeamMemberFormSchema) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = member
        ? await updateTeamMemberAction(member.id, values)
        : await createTeamMemberAction(values)
      if (!result.success) {
        setError(result.error || 'Erreur inconnue')
        setIsLoading(false)
        return
      }
      router.push('/dashboard/team')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue')
    } finally {
      setIsLoading(false)
    }
  }

  return { form, onSubmit, isLoading, error }
}
