"use client"

import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Briefcase } from "lucide-react"
import Link from "next/link"
import { PROJECT_STATUSES } from "@/lib/constants"
import { Progress } from "@/components/ui/progress"

interface Project {
  id: string
  name: string
  description: string | null
  status: string
  start_date: string | null
  end_date: string | null
  clients: {
    name: string
  }
}

interface RecentProjectsProps {
  projects: Project[]
}

export function RecentProjects({ projects }: RecentProjectsProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig = PROJECT_STATUSES.find((s) => s.value === status) || PROJECT_STATUSES[0]
    return <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
  }

  const getRandomProgress = () => {
    return Math.floor(Math.random() * 100)
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Briefcase className="h-10 w-10 text-muted-foreground opacity-40" />
        <h3 className="mt-4 text-lg font-medium">Aucun projet récent</h3>
        <p className="mt-1 text-sm text-muted-foreground">Commencez par créer un nouveau projet</p>
        <Button className="mt-4" asChild>
          <Link href="/dashboard/projects/new">Créer un projet</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="divide-y">
      {projects.map((project) => (
        <div key={project.id} className="p-4 hover:bg-muted/50 transition-colors">
          <div className="flex items-center justify-between">
            <Link href={`/dashboard/projects/${project.id}`} className="font-medium text-primary hover:underline">
              {project.name}
            </Link>
            {getStatusBadge(project.status)}
          </div>
          <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
            {project.description || "Aucune description"}
          </p>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <span>Client:</span>
              <span className="font-medium text-foreground">{project.clients.name}</span>
            </div>
            <div>
              {project.start_date ? formatDate(project.start_date) : "Non démarré"}
              {project.end_date ? ` - ${formatDate(project.end_date)}` : ""}
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progression</span>
              <span className="font-medium">{getRandomProgress()}%</span>
            </div>
            <Progress value={getRandomProgress()} className="h-1.5" />
          </div>
        </div>
      ))}
    </div>
  )
}
