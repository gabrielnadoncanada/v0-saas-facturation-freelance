import type React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Loader2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DatePicker } from '@/components/ui/date-picker'
import { Project } from '@/features/project/shared/types/project.types'
import { Task } from '@/features/task/shared/types/task.types'

interface TimeEntryFormViewProps {
  projects: Project[]
  tasks: Task[]
  formData: {
    project_id: string
    task_id: string | null
    date: Date
    hours: number
    description: string
  }
  onChange: (name: string, value: any) => void
  onSubmit: (e: React.FormEvent) => void
  isLoading: boolean
  error: string | null
  isEdit?: boolean
}

export function TimeEntryFormView({
  projects,
  tasks,
  formData,
  onChange,
  onSubmit,
  isLoading,
  error,
  isEdit = false,
}: TimeEntryFormViewProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="project">Projet</Label>
        <Select value={formData.project_id} onValueChange={(value) => onChange('project_id', value)}>
          <SelectTrigger id="project">
            <SelectValue placeholder="Sélectionner un projet" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="task_id">Tâche (optionnel)</Label>
        <Select
          value={formData.task_id || ''}
          onValueChange={(value) => onChange('task_id', value)}
        >
          <SelectTrigger id="task_id">
            <SelectValue placeholder="Sélectionner une tâche" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Aucune</SelectItem>
            {tasks.map((t) => (
              <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <DatePicker date={formData.date} setDate={(date) => onChange('date', date)} className="w-full" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hours">Heures</Label>
          <Input id="hours" type="number" step="0.25" min="0" value={formData.hours} onChange={(e) => onChange('hours', parseFloat(e.target.value))} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={formData.description} onChange={(e) => onChange('description', e.target.value)} rows={3} />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? 'Mettre à jour' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  )
}
