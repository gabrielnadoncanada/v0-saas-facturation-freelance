'use client'

import { Project } from '@/features/project/shared/types/project.types'
import { TimeEntry } from '@/features/time-tracking/shared/types/timeEntry.types'
import { useTimeEntryForm } from '@/features/time-tracking/shared/hooks/useTimeEntryForm'
import { TimeEntryFormView } from '@/features/time-tracking/shared/ui/TimeEntryFormView'

export function TimeEntryForm({ projects, entry, onSuccess }: { projects: Project[]; entry: TimeEntry | null; onSuccess?: () => void }) {
  const form = useTimeEntryForm({ entry, onSuccess })

  return (
    <TimeEntryFormView
      projects={projects}
      formData={form.formData}
      onChange={form.handleChange}
      onSubmit={form.handleSubmit}
      isLoading={form.isLoading}
      error={form.error}
      isEdit={!!entry}
    />
  )
}
