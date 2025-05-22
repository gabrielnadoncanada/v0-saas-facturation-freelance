import { TeamMembersTable } from '@/features/team/list/ui/TeamMembersTable'
import { getTeamMembersAction } from '@/features/team/list/actions/getTeamMembers.action'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function TeamPage() {
  const result = await getTeamMembersAction()

  if (!result.success) {
    return <div>Error: {result.error}</div>
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Équipe</h1>
          <p className="text-muted-foreground">Gérez les membres de votre équipe</p>
        </div>
        <Link href="/dashboard/team/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau membre
          </Button>
        </Link>
      </div>
      <TeamMembersTable members={result.data} />
    </div>
  )
}
