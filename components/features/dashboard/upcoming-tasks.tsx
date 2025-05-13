"use client"

import { formatRelativeTime } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Clock, ListTodo } from "lucide-react"
import Link from "next/link"
import { TASK_PRIORITIES, TASK_STATUSES } from "@/lib/constants"
import { Checkbox } from "@/components/ui/checkbox"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface Task {
  id: string
  name: string
  description: string | null
  status: string
  priority: string
  due_date: string | null
  projects: {
    id: string
    name: string
  }
}

interface UpcomingTasksProps {
  tasks: Task[]
}

export function UpcomingTasks({ tasks: initialTasks }: UpcomingTasksProps) {
  const [tasks, setTasks] = useState(initialTasks)
  const router = useRouter()
  const supabase = createClient()

  const getStatusBadge = (status: string) => {
    const statusConfig = TASK_STATUSES.find((s) => s.value === status) || TASK_STATUSES[0]
    return <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = TASK_PRIORITIES.find((p) => p.value === priority) || TASK_PRIORITIES[0]
    return (
      <Badge variant="outline" className={priorityConfig.color}>
        {priorityConfig.label}
      </Badge>
    )
  }

  const handleTaskComplete = async (taskId: string) => {
    const { error } = await supabase.from("tasks").update({ status: "completed" }).eq("id", taskId)

    if (!error) {
      setTasks(tasks.filter((task) => task.id !== taskId))
      router.refresh()
    }
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <ListTodo className="h-10 w-10 text-muted-foreground opacity-40" />
        <h3 className="mt-4 text-lg font-medium">Aucune tâche à venir</h3>
        <p className="mt-1 text-sm text-muted-foreground">Vous êtes à jour !</p>
      </div>
    )
  }

  return (
    <div className="divide-y">
      {tasks.map((task) => (
        <div key={task.id} className="p-4 hover:bg-muted/50 transition-colors">
          <div className="flex items-start gap-3">
            <Checkbox id={`task-${task.id}`} className="mt-1" onCheckedChange={() => handleTaskComplete(task.id)} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <label
                  htmlFor={`task-${task.id}`}
                  className="cursor-pointer font-medium hover:text-primary hover:underline"
                >
                  {task.name}
                </label>
                <div className="flex flex-wrap gap-1">
                  {getStatusBadge(task.status)}
                  {getPriorityBadge(task.priority)}
                </div>
              </div>
              <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                {task.description || "Aucune description"}
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <Link
                  href={`/dashboard/projects/${task.projects.id}`}
                  className="flex items-center gap-1 hover:text-primary hover:underline"
                >
                  <span>Projet:</span>
                  <span className="font-medium">{task.projects.name}</span>
                </Link>
                {task.due_date && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Échéance: </span>
                    <span className="font-medium">{formatRelativeTime(task.due_date)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
