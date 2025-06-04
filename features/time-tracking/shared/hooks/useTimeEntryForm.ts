import { useState } from 'react';
import { createTimeEntryAction } from '@/features/time-tracking/create/actions/createTimeEntry.action';
import { updateTimeEntryAction } from '@/features/time-tracking/edit/actions/updateTimeEntry.action';
import { TimeEntry } from '@/features/time-tracking/shared/types/timeEntry.types';

interface UseTimeEntryFormProps {
  entry: TimeEntry | null;
  onSuccess?: () => void;
}

export function useTimeEntryForm({ entry, onSuccess }: UseTimeEntryFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    project_id: entry?.project_id || '',
    task_id: entry?.task_id || '',
    date: entry ? new Date(entry.date as string) : new Date(),
    hours: entry?.hours || 0,
    description: entry?.description || '',
  });

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const dataToSubmit = {
      ...formData,
      date: formData.date,
      hours: Number(formData.hours),
    };

    try {
      let result;
      if (entry) {
        result = await updateTimeEntryAction(entry.id, dataToSubmit);
      } else {
        result = await createTimeEntryAction(dataToSubmit);
      }

      if (!result || !result.success) {
        setError(result?.error || 'Erreur inconnue');
        return;
      }

      onSuccess && onSuccess();
    } catch (err) {
      setError('Une erreur est survenue');
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
