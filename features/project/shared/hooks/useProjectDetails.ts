import { useState } from "react"
import { useRouter } from "next/navigation"
import { Project } from "@/features/project/shared/types/project.types"

export function useProjectDetails(project: Project) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [assigneeFilter, setAssigneeFilter] = useState<string | null>(null)

  // Calculer les statistiques du projet
  const completedTasks = project.tasks.filter((task) => task.status === "completed").length
  const totalTasks = project.tasks.length
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  // Filtrer les tâches en fonction des filtres sélectionnés
  const filteredTasks = project.tasks.filter((task) => {
    if (statusFilter && task.status !== statusFilter) return false
    if (assigneeFilter && task.assigned_to !== assigneeFilter) return false
    return true
  })

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
    filteredTasks,
    router,
  }
} 