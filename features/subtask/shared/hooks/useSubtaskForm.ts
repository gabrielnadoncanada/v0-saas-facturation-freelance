import { useState } from 'react';
import { createSubtaskAction } from '@/features/subtask/create/actions/createSubtask.action';
import { updateSubtaskAction } from '@/features/subtask/edit/actions/updateSubtask.action';
import { Task, TaskFormData } from '@/features/task/shared/types/task.types';

interface UseSubtaskFormProps {
  taskId: string;
  subtask: Task | null;
  onSuccess: () => void;
}

export function useSubtaskForm({ taskId, subtask, onSuccess }: UseSubtaskFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<TaskFormData>({
    name: subtask?.name || '',
    description: subtask?.description || '',
    status: subtask?.status || 'pending',
    due_date: undefined,
    assigned_to: undefined,
  });

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = subtask
        ? await updateSubtaskAction(subtask.id, formData)
        : await createSubtaskAction(taskId, formData);

      if (!result.success) {
        setError(result.error || 'Erreur inconnue');
        return;
      }

      onSuccess();
    } catch (err) {
      setError('Une erreur est survenue lors de la soumission');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    isLoading,
    error,
  };
}
