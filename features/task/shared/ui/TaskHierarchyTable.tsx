import { useState } from "react"
import { Task } from "@/features/task/shared/types/task.types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight } from "lucide-react"

interface TaskHierarchyTableProps {
  tasks: Task[]
  onSelect?: (task: Task) => void
}

export function TaskHierarchyTable({ tasks, onSelect }: TaskHierarchyTableProps) {
  const [open, setOpen] = useState<Record<string, boolean>>({})

  const toggle = (id: string) => {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }))
  }

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

  const renderRows = (items: Task[], level = 0): JSX.Element[] => {
    return items.flatMap((task) => {
      const hasChildren = task.subtasks && task.subtasks.length > 0
      const rows = [
        <TableRow key={task.id} className="hover:bg-muted/50">
          <TableCell className="px-3 py-2">
            <div className="flex items-center" style={{ marginLeft: level * 16 }}>
              {hasChildren && (
                <button
                  onClick={() => toggle(task.id)}
                  className="mr-1 text-muted-foreground"
                >
                  {open[task.id] ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              )}
              <span
                className="cursor-pointer"
                onClick={() => onSelect && onSelect(task)}
              >
                {task.name}
              </span>
            </div>
          </TableCell>
          <TableCell className="px-3 py-2">
            <Badge className={getStatusBadgeClass(task.status)}>
              {getStatusLabel(task.status)}
            </Badge>
          </TableCell>
          <TableCell className="px-3 py-2 text-center">
            {task.subtasks ? task.subtasks.length : 0}
          </TableCell>
        </TableRow>,
      ]

      if (hasChildren && open[task.id]) {
        rows.push(...renderRows(task.subtasks!, level + 1))
      }

      return rows
    })
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="px-3 py-2">Nom</TableHead>
          <TableHead className="px-3 py-2">Statut</TableHead>
          <TableHead className="px-3 py-2 text-center">Sous-tâches</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.length === 0 ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center py-4">
              Aucune tâche
            </TableCell>
          </TableRow>
        ) : (
          renderRows(tasks)
        )}
      </TableBody>
    </Table>
  )
}
