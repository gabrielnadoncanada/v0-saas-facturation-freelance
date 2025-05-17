import { useState } from "react"
import { useRouter } from "next/navigation"
import { formatCurrency, formatDate, formatDuration } from "@/shared/lib/utils"
import { Project } from "@/shared/types/projects/project"
import { Task } from "@/shared/types/tasks/task"

export function useProjectDetails({
  project,
  tasks,
  timeEntries,
  userId,
  teamMembers,
}: {
  project: Project
  tasks: Task[]
  timeEntries: any[]
  userId: string
  teamMembers: any[]
}) {
  const router = useRouter()
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

  return {
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
    totalTimeSpent,
    totalHours,
    currentCost,
    filteredTasks,
    getStatusLabel,
    getStatusBadgeClass,
    getTaskStatusLabel,
    router,
  }
} 