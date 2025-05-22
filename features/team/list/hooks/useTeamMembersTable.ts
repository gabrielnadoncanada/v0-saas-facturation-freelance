import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { deleteTeamMemberAction } from '@/features/team/delete/actions/deleteTeamMember.action'
import { TeamMember } from '@/features/team/shared/types/team.types'

export function useTeamMembersTable(members: TeamMember[]) {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!memberToDelete) return
    const result = await deleteTeamMemberAction(memberToDelete)
    if (result.success) {
      router.refresh()
    }
    setDeleteDialogOpen(false)
    setMemberToDelete(null)
  }

  return {
    members,
    deleteDialogOpen,
    setDeleteDialogOpen,
    memberToDelete,
    setMemberToDelete,
    handleDelete,
    router,
  }
}
