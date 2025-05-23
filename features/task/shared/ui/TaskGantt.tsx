"use client"

import { Task } from "@/features/task/shared/types/task.types"
import { differenceInCalendarDays, format } from "date-fns"

export function TaskGantt({ tasks, projectStartDate }: { tasks: Task[]; projectStartDate?: string }) {
  if (!projectStartDate) {
    return <p className="text-sm text-muted-foreground">Aucune date de début du projet</p>
  }

  const start = new Date(projectStartDate)
  const endDates = tasks.filter((t) => t.due_date).map((t) => new Date(t.due_date!))
  const projectEnd = endDates.length ? new Date(Math.max(...endDates.map((d) => d.getTime()))) : start
  const totalDays = Math.max(differenceInCalendarDays(projectEnd, start) + 1, 1)

  return (
    <div className="space-y-2">
      {tasks.map((task) => {
        if (!task.due_date) return null
        const taskEnd = new Date(task.due_date)
        const offset = differenceInCalendarDays(taskEnd, start)
        const width = ((offset + 1) / totalDays) * 100
        return (
          <div key={task.id} className="flex items-center space-x-2">
            <span className="w-32 text-sm truncate">{task.name}</span>
            <div className="flex-1 relative h-4 bg-muted rounded-sm">
              <div className="absolute left-0 top-0 h-4 bg-primary rounded-sm" style={{ width: `${width}%` }} />
            </div>
            <span className="w-24 text-sm text-right">{format(taskEnd, "dd/MM/yyyy")}</span>
          </div>
        )
      })}
    </div>
  )
}
