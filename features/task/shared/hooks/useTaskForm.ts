import { useState } from "react"
import { createTaskAction } from "@/features/task/create/actions/createTask.action"
import { updateTaskAction } from "@/features/task/edit/actions/updateTask.action"
import { Task } from "@/shared/types/tasks/task"

interface UseTaskFormProps {
  projectId: string
  task: Task | null
  onSuccess: () => void
}

export function useTaskForm({ projectId, task, onSuccess }: UseTaskFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: task?.name || "",
    description: task?.description || "",
    status: task?.status || "pending",
    priority: task?.priority || "medium",
    estimated_hours: task?.estimated_hours ? String(task.estimated_hours) : "",
    due_date: task?.due_date ? new Date(task.due_date) : null,
    assigned_to: task?.assigned_to || null,
  })

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name === "estimated_hours" ? String(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Préparer les données à soumettre
      const dataToSubmit = {
        ...formData,
        due_date: formData.due_date ? formData.due_date.toISOString().split("T")[0] : undefined,
        estimated_hours: formData.estimated_hours ? Number(formData.estimated_hours) : null,
        assigned_to:
          formData.assigned_to === "unassigned" || !formData.assigned_to
            ? undefined
            : formData.assigned_to,
      }

      let result

      if (task) {
        // Mettre à jour une tâche existante
        result = await updateTaskAction(task.id, dataToSubmit)
      } else {
        // Créer une nouvelle tâche
        result = await createTaskAction(projectId, dataToSubmit)
      }

      if (!result.success) {
        setError(result.error || "Erreur inconnue")
        return
      }

      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      console.error("Erreur inattendue:", err)
      setError("Une erreur est survenue lors de la soumission du formulaire")
    } finally {
      setIsLoading(false)
    }
  }

  return {
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    isLoading,
    error,
    setError,
  }
} 