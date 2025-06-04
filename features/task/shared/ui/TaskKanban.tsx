'use client';

import { useState, useEffect } from 'react';
import { Task } from '@/features/task/shared/types/task.types';
import { createClient } from '@/shared/lib/supabase/client';
import {
  DndContext,
  closestCorners,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { SortableTaskCard } from './SortableTaskCard';
import { TaskForm } from './TaskForm';

const columns = [
  { status: 'pending', label: 'À faire' },
  { status: 'in_progress', label: 'En cours' },
  { status: 'blocked', label: 'Bloquée' },
  { status: 'completed', label: 'Terminée' },
];

interface TaskKanbanProps {
  tasks: Task[];
  projectId: string;
  onTaskUpdate: () => void;
}

export function TaskKanban({ tasks, projectId, onTaskUpdate }: TaskKanbanProps) {
  const supabase = createClient();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const [columnTasks, setColumnTasks] = useState<Record<string, Task[]>>({});
  const [createInColumn, setCreateInColumn] = useState<string | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);

  useEffect(() => {
    const byStatus: Record<string, Task[]> = {};
    columns.forEach((c) => {
      byStatus[c.status] = tasks.filter((t) => t.status === c.status);
    });
    setColumnTasks(byStatus);
  }, [tasks]);

  const findColumn = (taskId: string) => {
    return columns.find((c) => columnTasks[c.status]?.some((t) => t.id === taskId))?.status;
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeColumn = findColumn(activeId);
    let overColumn = columns.find((c) => c.status === overId)?.status;

    if (!overColumn) {
      overColumn = findColumn(overId) || overId;
    }

    if (!activeColumn || !overColumn) return;

    if (activeColumn === overColumn) {
      const oldIndex = columnTasks[activeColumn].findIndex((t) => t.id === activeId);
      const newIndex = columnTasks[activeColumn].findIndex((t) => t.id === overId);
      if (oldIndex !== newIndex && newIndex !== -1) {
        setColumnTasks((prev) => ({
          ...prev,
          [activeColumn]: arrayMove(prev[activeColumn], oldIndex, newIndex),
        }));
      }
    } else {
      const oldIndex = columnTasks[activeColumn].findIndex((t) => t.id === activeId);
      const task = columnTasks[activeColumn][oldIndex];
      setColumnTasks((prev) => {
        const source = [...prev[activeColumn]];
        source.splice(oldIndex, 1);
        const dest = [...prev[overColumn]];
        dest.splice(0, 0, { ...task, status: overColumn });
        return { ...prev, [activeColumn]: source, [overColumn]: dest };
      });
      await supabase.from('tasks').update({ status: overColumn }).eq('id', activeId);
      onTaskUpdate && onTaskUpdate();
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = (dueDate: string | null | undefined) => {
    if (!dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDueDate = new Date(dueDate);
    return taskDueDate < today;
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {columns.map((col) => {
          const tasksForCol = columnTasks[col.status] || [];
          return (
            <div key={col.status} className="border rounded-md p-2 bg-background flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{col.label}</h4>
                <Dialog
                  open={createInColumn === col.status}
                  onOpenChange={(o) => !o && setCreateInColumn(null)}
                >
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => setCreateInColumn(col.status)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ajouter une tâche</DialogTitle>
                    </DialogHeader>
                    <TaskForm
                      projectId={projectId}
                      task={null}
                      defaultStatus={col.status}
                      onSuccess={() => {
                        setCreateInColumn(null);
                        onTaskUpdate && onTaskUpdate();
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </div>
              <SortableContext
                items={tasksForCol.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
                id={col.status}
              >
                <div className="space-y-2 min-h-[50px] flex-1">
                  {tasksForCol.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Aucune tâche</p>
                  ) : (
                    tasksForCol.map((task) => (
                      <SortableTaskCard
                        key={task.id}
                        task={task}
                        getPriorityBadgeClass={getPriorityBadgeClass}
                        getStatusBadgeClass={getStatusBadgeClass}
                        isOverdue={isOverdue}
                        onClick={() => setEditTask(task)}
                      />
                    ))
                  )}
                </div>
              </SortableContext>
            </div>
          );
        })}
      </div>

      <Dialog open={!!editTask} onOpenChange={(o) => !o && setEditTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la tâche</DialogTitle>
          </DialogHeader>
          {editTask && (
            <TaskForm
              projectId={projectId}
              task={editTask}
              onSuccess={() => {
                setEditTask(null);
                onTaskUpdate && onTaskUpdate();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </DndContext>
  );
}
