import { TeamMemberForm } from '@/features/team/shared/ui/TeamMemberForm'
import { getTeamMemberAction } from '@/features/team/shared/actions/getTeamMember.action'

export default async function EditTeamMemberPage({ params }: { params: { id: string } }) {
  const result = await getTeamMemberAction(params.id)

  if (!result.success) {
    return <div>{result.error}</div>
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Modifier le membre</h1>
        <p className="text-muted-foreground">Mettre à jour les informations du membre</p>
      </div>
      <TeamMemberForm member={result.data} />
    </div>
  )
}
