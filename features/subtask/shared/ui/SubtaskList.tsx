'use client';

import { useState } from 'react';
import { createClient } from '@/shared/lib/supabase/client';
import { Task } from '@/features/task/shared/types/task.types';
import { SubtaskForm } from '@/features/subtask/shared/ui/SubtaskForm';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function SubtaskList({
  subtasks,
  taskId,
  onSubtaskUpdate,
}: {
  subtasks: Task[];
  taskId: string;
  onSubtaskUpdate?: () => void;
}) {
  const supabase = createClient();
  const [editSubtask, setEditSubtask] = useState<Task | null>(null);
  const [deleteSubtask, setDeleteSubtask] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!subtasks || subtasks.length === 0) return null;

  const markSubtaskAsCompleted = async (subtaskId: string, completed: boolean) => {
    const { error } = await supabase
      .from('tasks')
      .update({ status: completed ? 'completed' : 'pending' })
      .eq('id', subtaskId);

    if (error) {
      console.error('Erreur lors de la mise \u00e0 jour de la sous-t\u00e2che:', error);
      return;
    }

    onSubtaskUpdate && onSubtaskUpdate();
  };

  const handleDeleteSubtask = async () => {
    if (!deleteSubtask) return;
    setIsDeleting(true);

    try {
      const { error } = await supabase.from('tasks').delete().eq('id', deleteSubtask.id);
      if (error) {
        console.error('Erreur lors de la suppression de la sous-t\u00e2che:', error);
        return;
      }
      setDeleteSubtask(null);
      onSubtaskUpdate && onSubtaskUpdate();
    } catch (err) {
      console.error('Erreur inattendue lors de la suppression:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="ml-6 mt-2">
      <Accordion type="multiple" className="space-y-1">
        {subtasks.map((st) => (
          <AccordionItem value={st.id} key={st.id} className="border-b-0">
            <div className="flex items-start gap-2 py-1">
              <Checkbox
                checked={st.status === 'completed'}
                onCheckedChange={(checked) => markSubtaskAsCompleted(st.id, checked as boolean)}
                className="mt-1"
              />
              <AccordionTrigger className="flex-1 text-left">{st.name}</AccordionTrigger>
              <div className="flex items-center space-x-1">
                <Button size="icon" variant="ghost" onClick={() => setEditSubtask(st)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setDeleteSubtask(st)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <AccordionContent className="ml-6">
              {st.description && (
                <p className="text-sm text-muted-foreground mb-2">{st.description}</p>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Dialog open={!!editSubtask} onOpenChange={(open) => !open && setEditSubtask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la sous-t\u00e2che</DialogTitle>
          </DialogHeader>
          {editSubtask && (
            <SubtaskForm
              taskId={taskId}
              subtask={editSubtask}
              onSuccess={() => {
                setEditSubtask(null);
                onSubtaskUpdate && onSubtaskUpdate();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteSubtask} onOpenChange={(open) => !open && setDeleteSubtask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <p>
            Êtes-vous s\u00fbr de vouloir supprimer la sous-t\u00e2che{' '}
            <strong>{deleteSubtask?.name}</strong> ? Cette action est irr\u00e9versible.
          </p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteSubtask} disabled={isDeleting}>
              {isDeleting ? 'Suppression...' : 'Supprimer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
