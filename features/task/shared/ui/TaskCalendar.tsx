"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Task } from "@/features/task/shared/types/task.types"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export function TaskCalendar({ tasks }: { tasks: Task[] }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const tasksForDate = tasks.filter((t) => {
    if (!t.due_date || !selectedDate) return false
    return (
      format(new Date(t.due_date), "yyyy-MM-dd") ===
      format(selectedDate, "yyyy-MM-dd")
    )
  })

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        locale={fr}
        className="w-auto"
      />
      <div className="flex-1 space-y-2 overflow-y-auto max-h-[400px]">
        {tasksForDate.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune tâche</p>
        ) : (
          tasksForDate.map((task) => (
            <div key={task.id} className="border rounded-md p-2">
              <p className="font-medium">{task.name}</p>
              {task.description && (
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {task.description}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
