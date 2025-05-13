import { ProjectsTable } from "@/components/features/projects/projects-table"
import { Button } from "@/components/ui/button"
import { getAllProjects } from "@/app/actions/projects"
import { Plus } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function ProjectsPage() {
  const result = await getAllProjects()

  if (!result.success) {
    redirect("/login")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projets</h1>
          <p className="text-muted-foreground">Gérez vos projets et suivez leur avancement</p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau projet
          </Button>
        </Link>
      </div>

      <ProjectsTable projects={result.data || []} />
    </div>
  )
}
