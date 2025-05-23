"use client"

import { Task } from "@/features/task/shared/types/task.types"

const columns = [
  { status: "pending", label: "À faire" },
  { status: "in_progress", label: "En cours" },
  { status: "completed", label: "Terminée" },
  { status: "blocked", label: "Bloquée" },
]

export function TaskKanban({ tasks }: { tasks: Task[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.status)
        return (
          <div key={col.status} className="border rounded-md p-2 bg-background">
            <h4 className="font-semibold mb-2">{col.label}</h4>
            <div className="space-y-2 min-h-[50px]">
              {colTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune tâche</p>
              ) : (
                colTasks.map((task) => (
                  <div key={task.id} className="p-2 bg-muted rounded-md">
                    {task.name}
                  </div>
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
