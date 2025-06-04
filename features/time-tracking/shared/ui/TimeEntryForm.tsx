'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/shared/lib/supabase/client';
import { Project } from '@/features/project/shared/types/project.types';
import { TimeEntry } from '@/features/time-tracking/shared/types/timeEntry.types';
import { Task } from '@/features/task/shared/types/task.types';
import { useTimeEntryForm } from '@/features/time-tracking/shared/hooks/useTimeEntryForm';
import { TimeEntryFormView } from '@/features/time-tracking/shared/ui/TimeEntryFormView';

export function TimeEntryForm({
  projects,
  entry,
  onSuccess,
}: {
  projects: Project[];
  entry: TimeEntry | null;
  onSuccess?: () => void;
}) {
  const form = useTimeEntryForm({ entry, onSuccess });
  const supabase = createClient();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    async function loadTasks() {
      if (!form.formData.project_id) {
        setTasks([]);
        return;
      }
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', form.formData.project_id);
      if (!error && data) {
        setTasks(data as Task[]);
      } else {
        setTasks([]);
      }
    }

    loadTasks();
  }, [form.formData.project_id]);

  return (
    <TimeEntryFormView
      projects={projects}
      tasks={tasks}
      formData={form.formData}
      onChange={form.handleChange}
      onSubmit={form.handleSubmit}
      isLoading={form.isLoading}
      error={form.error}
      isEdit={!!entry}
    />
  );
}
