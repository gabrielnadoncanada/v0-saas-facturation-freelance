export interface TimeEntry {
  id: string
  user_id?: string
  project_id: string
  task_id?: string | null
  date: Date | string
  hours: number
  description?: string
  created_at?: string
  updated_at?: string
  project?: { name: string }
  task?: { name: string | null }
}

export interface TimeEntryFormData {
  project_id: string
  task_id?: string | null
  date: Date
  hours: number
  description: string
}
