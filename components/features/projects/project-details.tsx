"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency, formatDate, formatDuration } from "@/lib/utils"
import { ArrowLeft, Edit, Plus, Filter } from "lucide-react"
import Link from "next/link"
import { TaskList } from "@/components/features/projects/task-list"
import { TaskForm } from "@/components/features/projects/task-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { TimeTrackingList } from "@/components/features/projects/time-tracking-list"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ProjectDetailsProps {
  project: any
  tasks: any[]
  timeEntries: any[]
  userId: string | undefined
  teamMembers: any[]
}

export function ProjectDetails({ project, tasks, timeEntries, userId, teamMembers }: ProjectDetailsProps) {
  const router = useRouter()
  const supabase = createClient()
  const [error, setError] = useState<string | null>(null)
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [assigneeFilter, setAssigneeFilter] = useState<string | null>(null)

  // Calculer les statistiques du projet
  const completedTasks = tasks.filter((task) => task.status === "completed").length
  const totalTasks = tasks.length
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  // Calculer le temps total passé sur le projet
  const totalTimeSpent = timeEntries.reduce((total, entry) => total + (entry.duration || 0), 0)
  const totalHours = totalTimeSpent / 3600

  // Calculer le coût actuel basé sur le temps passé
  const currentCost = timeEntries.reduce((total, entry) => {
    const hours = (entry.duration || 0) / 3600
    return total + hours * entry.hourly_rate
  }, 0)

  // Filtrer les tâches en fonction des filtres sélectionnés
  const filteredTasks = tasks.filter((task) => {
    if (statusFilter && task.status !== statusFilter) return false
    if (assigneeFilter && task.assigned_to !== assigneeFilter) return false
    return true
  })

  // Obtenir le libellé du statut
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Actif"
      case "completed":
        return "Terminé"
      case "on_hold":
        return "En pause"
      case "cancelled":
        return "Annulé"
      default:
        return status
    }
  }

  // Obtenir la couleur du badge de statut
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "on_hold":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Obtenir le libellé du statut de tâche
  const getTaskStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "À faire"
      case "in_progress":
        return "En cours"
      case "completed":
        return "Terminée"
      case "blocked":
        return "Bloquée"
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/projects">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
            <p className="text-muted-foreground">Client: {project.clients.name}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getStatusBadgeClass(project.status)}>{getStatusLabel(project.status)}</Badge>
          <Link href={`/dashboard/projects/${project.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Détails du projet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {project.description && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p className="whitespace-pre-line">{project.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date de début</p>
                <p>{project.start_date ? formatDate(project.start_date) : "Non définie"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date de fin</p>
                <p>{project.end_date ? formatDate(project.end_date) : "Non définie"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Budget</p>
                <p>{project.budget ? formatCurrency(project.budget) : "Non défini"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Coût actuel</p>
                <p>{formatCurrency(currentCost)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progression</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tâches complétées</span>
                <span>
                  {completedTasks} / {totalTasks}
                </span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Temps total</p>
                <p>{formatDuration(totalTimeSpent)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Coût / Budget</p>
                <p>
                  {formatCurrency(currentCost)} / {project.budget ? formatCurrency(project.budget) : "-"}
                </p>
              </div>
              {project.budget && (
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Utilisation du budget</p>
                  <Progress
                    value={(currentCost / project.budget) * 100}
                    className="h-2"
                    indicatorClassName={currentCost > project.budget ? "bg-red-500" : undefined}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tasks" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="tasks">Tâches</TabsTrigger>
            <TabsTrigger value="time">Suivi du temps</TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtrer
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filtrer par statut</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setStatusFilter(null)} className={!statusFilter ? "bg-muted" : ""}>
                  Tous les statuts
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setStatusFilter("pending")}
                  className={statusFilter === "pending" ? "bg-muted" : ""}
                >
                  À faire
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setStatusFilter("in_progress")}
                  className={statusFilter === "in_progress" ? "bg-muted" : ""}
                >
                  En cours
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setStatusFilter("completed")}
                  className={statusFilter === "completed" ? "bg-muted" : ""}
                >
                  Terminée
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setStatusFilter("blocked")}
                  className={statusFilter === "blocked" ? "bg-muted" : ""}
                >
                  Bloquée
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuLabel>Filtrer par assigné</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setAssigneeFilter(null)} className={!assigneeFilter ? "bg-muted" : ""}>
                  Tous les assignés
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setAssigneeFilter("unassigned")}
                  className={assigneeFilter === "unassigned" ? "bg-muted" : ""}
                >
                  Non assignées
                </DropdownMenuItem>
                {teamMembers.map((member) => (
                  <DropdownMenuItem
                    key={member.id}
                    onClick={() => setAssigneeFilter(member.id)}
                    className={assigneeFilter === member.id ? "bg-muted" : ""}
                  >
                    {member.full_name || member.email}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex space-x-2">
              <Link href={`/dashboard/projects/${project.id}/tasks/new`}>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle tâche
                </Button>
              </Link>
              <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Ajout rapide
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter une tâche</DialogTitle>
                  </DialogHeader>
                  <TaskForm
                    projectId={project.id}
                    teamMembers={teamMembers}
                    onSuccess={() => {
                      setTaskDialogOpen(false)
                      router.refresh()
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <TabsContent value="tasks" className="space-y-4">
          <TaskList
            tasks={filteredTasks}
            teamMembers={teamMembers}
            onTaskUpdate={() => router.refresh()}
            onTaskDelete={() => router.refresh()}
          />
        </TabsContent>

        <TabsContent value="time" className="space-y-4">
          <TimeTrackingList
            timeEntries={timeEntries}
            tasks={tasks}
            projectId={project.id}
            userId={userId}
            clientId={project.client_id}
            onSuccess={() => router.refresh()}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
