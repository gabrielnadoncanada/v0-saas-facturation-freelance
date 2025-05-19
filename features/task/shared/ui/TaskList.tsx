"use client"

import { useState } from "react"
import { createClient } from "@/shared/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { formatDate } from "@/shared/lib/utils"
import { Edit, Trash2, Clock, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog"
import { TaskForm } from "@/features/task/shared/TaskForm"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Task } from "@/features/task/shared/types/task.types"


export function TaskList({ tasks, onTaskUpdate, onTaskDelete }: { tasks: Task[], onTaskUpdate: () => void, onTaskDelete: () => void }) {
  const supabase = createClient()
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [deleteTask, setDeleteTask] = useState<Task | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fonction pour obtenir les initiales d'un nom
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Fonction pour obtenir le libellé du statut
  const getStatusLabel = (status: string) => {
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

  // Fonction pour obtenir la couleur du badge de statut
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-gray-100 text-gray-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "blocked":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Fonction pour obtenir la couleur du badge de priorité
  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Fonction pour obtenir le libellé de la priorité
  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "low":
        return "Basse"
      case "medium":
        return "Moyenne"
      case "high":
        return "Haute"
      default:
        return priority
    }
  }

  // Fonction pour marquer une tâche comme terminée
  const markTaskAsCompleted = async (taskId: string, isCompleted: boolean) => {
    const { error } = await supabase
      .from("tasks")
      .update({ status: isCompleted ? "completed" : "pending" })
      .eq("id", taskId)

    if (error) {
      console.error("Erreur lors de la mise à jour du statut de la tâche:", error)
      return
    }

    if (onTaskUpdate) {
      onTaskUpdate()
    }
  }

  // Fonction pour supprimer une tâche
  const handleDeleteTask = async () => {
    if (!deleteTask) return

    setIsDeleting(true)

    try {
      const { error } = await supabase.from("tasks").delete().eq("id", deleteTask.id)

      if (error) {
        console.error("Erreur lors de la suppression de la tâche:", error)
        return
      }

      setDeleteTask(null)

      if (onTaskDelete) {
        onTaskDelete()
      }
    } catch (err) {
      console.error("Erreur inattendue lors de la suppression:", err)
    } finally {
      setIsDeleting(false)
    }
  }

  // Vérifier si une date est dépassée
  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const taskDueDate = new Date(dueDate)
    return taskDueDate < today
  }

  // Grouper les tâches par statut
  const tasksByStatus = tasks.reduce(
    (acc, task) => {
      if (!acc[task.status]) {
        acc[task.status] = []
      }
      acc[task.status].push(task)
      return acc
    },
    {} as Record<string, any[]>,
  )

  // Ordre des statuts pour l'affichage
  const statusOrder = ["pending", "in_progress", "blocked", "completed"]

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Aucune tâche pour ce projet. Créez votre première tâche en cliquant sur le bouton "Nouvelle tâche".
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {statusOrder.map((status) => {
        if (!tasksByStatus[status] || tasksByStatus[status].length === 0) return null

        return (
          <div key={status} className="space-y-2">
            <h3 className="text-lg font-medium">{getStatusLabel(status)}</h3>
            <div className="space-y-2">
              {tasksByStatus[status].map((task) => (
                <Card key={task.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex items-start p-4 gap-4">
                      <div className="flex-shrink-0 pt-1">
                        <Checkbox
                          checked={task.status === "completed"}
                          onCheckedChange={(checked) => markTaskAsCompleted(task.id, checked as boolean)}
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium truncate">{task.name}</h4>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            {task.priority && (
                              <Badge className={getPriorityBadgeClass(task.priority)}>
                                {getPriorityLabel(task.priority)}
                              </Badge>
                            )}
                            <Badge className={getStatusBadgeClass(task.status)}>{getStatusLabel(task.status)}</Badge>
                          </div>
                        </div>
                        {task.description && <p className="text-sm text-muted-foreground mb-2">{task.description}</p>}
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          {task.due_date && (
                            <div className="flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              <span className={isOverdue(task.due_date) ? "text-red-500 font-medium" : ""}>
                                {formatDate(task.due_date)}
                              </span>
                              {isOverdue(task.due_date) && task.status !== "completed" && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <AlertTriangle className="h-3.5 w-3.5 ml-1 text-red-500" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Date d'échéance dépassée</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                          )}
                          {task.estimated_hours && (
                            <div>
                              <span className="font-medium">{task.estimated_hours}h</span> estimées
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setEditTask(task)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Modifier la tâche</DialogTitle>
                            </DialogHeader>
                            <TaskForm
                              projectId={task.project_id}
                              task={task}
                              onSuccess={() => {
                                setEditTask(null)
                                if (onTaskUpdate) onTaskUpdate()
                              }}
                            />
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTask(task)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      })}

      {/* Dialogue de confirmation de suppression */}
      <Dialog open={!!deleteTask} onOpenChange={(open) => !open && setDeleteTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <p>
            Êtes-vous sûr de vouloir supprimer la tâche <strong>{deleteTask?.name}</strong> ? Cette action est
            irréversible.
          </p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteTask} disabled={isDeleting}>
              {isDeleting ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
