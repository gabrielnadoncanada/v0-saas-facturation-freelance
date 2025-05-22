import { TeamMemberForm } from '@/features/team/shared/ui/TeamMemberForm'

export default async function NewTeamMemberPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nouveau membre</h1>
        <p className="text-muted-foreground">Ajoutez un membre à votre équipe</p>
      </div>
      <TeamMemberForm member={null} />
    </div>
  )
}
