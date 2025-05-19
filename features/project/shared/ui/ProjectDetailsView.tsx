import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency, formatDate, formatDuration } from "@/shared/lib/utils"
import { ArrowLeft, Edit, Plus, Filter } from "lucide-react"
import Link from "next/link"
import { TaskList } from "@/features/task/shared/ui/TaskList"
import { TaskForm } from "@/features/task/shared/ui/TaskForm"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Task } from "@/features/task/shared/types/task.types"
import { Project } from "@/features/project/shared/types/project.types"

interface ProjectDetailsViewProps {
  project: Project
  error: string | null
  setError: (e: string | null) => void
  taskDialogOpen: boolean
  setTaskDialogOpen: (b: boolean) => void
  statusFilter: string | null
  setStatusFilter: (s: string | null) => void
  assigneeFilter: string | null
  setAssigneeFilter: (s: string | null) => void
  completedTasks: number
  totalTasks: number
  completionPercentage: number
  filteredTasks: Task[]
  getStatusLabel: (s: string) => string
  getStatusBadgeClass: (s: string) => string
  getTaskStatusLabel: (s: string) => string
  router: any
}

export const ProjectDetailsView: React.FC<ProjectDetailsViewProps> = ({
  project,
  error,
  setError,
  taskDialogOpen,
  setTaskDialogOpen,
  statusFilter,
  setStatusFilter,
  assigneeFilter,
  setAssigneeFilter,
  completedTasks,
  totalTasks,
  completionPercentage,
  filteredTasks,
  getStatusLabel,
  getStatusBadgeClass,
  getTaskStatusLabel,
  router,
}) => (
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
          {/* Adapter ici si project.clients n'existe pas dans le type Project */}
          <p className="text-muted-foreground">Client: {project.client?.name || "-"}</p>
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
        </CardContent>
      </Card>
    </div>

    <Tabs defaultValue="tasks" className="space-y-4">
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="tasks">Tâches</TabsTrigger>
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
                  task={null as unknown as Task}
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
          onTaskUpdate={() => router.refresh()}
          onTaskDelete={() => router.refresh()}
        />
      </TabsContent>
    </Tabs>
  </div>
) 