import { useState } from "react"
import { createClient } from "@/shared/lib/supabase/client"

export function useTimeTrackingList({
  timeEntries,
  tasks,
  projectId,
  clientId,
  onSuccess,
}: {
  timeEntries: any[]
  tasks: any[]
  projectId: string
  clientId: string
  onSuccess: () => void
}) {
  const supabase = createClient()
  const [addTimeDialogOpen, setAddTimeDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

  // Trier les entrées par date (plus récent en premier)
  const sortedEntries = [...timeEntries].sort(
    (a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime(),
  )

  const handleDeleteEntry = async () => {
    if (!entryToDelete) return
    const { error } = await supabase.from("time_entries").delete().eq("id", entryToDelete)
    if (!error) {
      onSuccess()
    }
    setDeleteDialogOpen(false)
    setEntryToDelete(null)
  }

  const startTimeTracking = (taskId: string) => {
    setSelectedTaskId(taskId)
    setAddTimeDialogOpen(true)
  }

  // Calculer le temps total par tâche
  const timeByTask = tasks.map((task) => {
    const taskEntries = timeEntries.filter((entry) => entry.task_id === task.id)
    const totalTime = taskEntries.reduce((total, entry) => total + (entry.duration || 0), 0)
    return {
      ...task,
      totalTime,
      entries: taskEntries,
    }
  })

  return {
    addTimeDialogOpen,
    setAddTimeDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    entryToDelete,
    setEntryToDelete,
    selectedTaskId,
    setSelectedTaskId,
    sortedEntries,
    timeByTask,
    handleDeleteEntry,
    startTimeTracking,
  }
} 