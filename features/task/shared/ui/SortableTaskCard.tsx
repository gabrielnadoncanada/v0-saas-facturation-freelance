import { Task } from '@/features/task/shared/types/task.types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn, formatDate } from '@/shared/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle } from 'lucide-react';

interface SortableTaskCardProps {
  task: Task;
  getPriorityBadgeClass: (p: string) => string;
  getStatusBadgeClass: (s: string) => string;
  isOverdue: (d: string | null | undefined) => boolean;
  onClick: () => void;
}

export function SortableTaskCard({
  task,
  getPriorityBadgeClass,
  getStatusBadgeClass,
  isOverdue,
  onClick,
}: SortableTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        'p-2 bg-muted rounded-md cursor-pointer border-l-4',
        isDragging && 'shadow-lg',
        task.priority === 'high' && 'border-red-500',
        task.priority === 'medium' && 'border-yellow-500',
        task.priority === 'low' && 'border-green-500',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="font-medium text-sm truncate flex-1">{task.name}</div>
        <div className="flex-shrink-0 space-x-1 flex items-center">
          {task.priority && (
            <Badge className={getPriorityBadgeClass(task.priority)}>{task.priority}</Badge>
          )}
          <Badge className={getStatusBadgeClass(task.status)}>{task.status}</Badge>
        </div>
      </div>
      {task.due_date && (
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          <Clock className="h-3 w-3 mr-1" />
          <span className={isOverdue(task.due_date) ? 'text-red-500 font-medium' : ''}>
            {formatDate(task.due_date)}
          </span>
          {isOverdue(task.due_date) && task.status !== 'completed' && (
            <AlertTriangle className="h-3 w-3 ml-1 text-red-500" />
          )}
        </div>
      )}
    </div>
  );
}
