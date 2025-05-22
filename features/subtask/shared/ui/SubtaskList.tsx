import { Task } from '@/features/task/shared/types/task.types'

export function SubtaskList({ subtasks }: { subtasks: Task[] }) {
  if (!subtasks || subtasks.length === 0) return null

  return (
    <ul className="ml-6 list-disc space-y-1">
      {subtasks.map((st) => (
        <li key={st.id} className="text-sm">
          {st.name} {st.status && <span className="text-muted-foreground">({st.status})</span>}
        </li>
      ))}
    </ul>
  )
}
