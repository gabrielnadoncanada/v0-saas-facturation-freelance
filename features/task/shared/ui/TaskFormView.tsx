import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"

interface TaskFormViewProps {
  formData: {
    name: string
    description: string
    status: string
    priority: string
    estimated_hours: string
    due_date: Date | null
    assigned_to: string | null
  }
  onChange: (name: string, value: any) => void
  onSubmit: (e: React.FormEvent) => void
  isLoading: boolean
  error: string | null
  isEdit?: boolean
  teamMembers: { id: string; name: string }[]
}

export function TaskFormView({
  formData,
  onChange,
  onSubmit,
  isLoading,
  error,
  isEdit = false,
  teamMembers,
}: TaskFormViewProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Nom de la tâche *</Label>
        <Input id="name" value={formData.name} onChange={(e) => onChange("name", e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => onChange("description", e.target.value)}
          rows={3}
          placeholder="Décrivez la tâche en détail..."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select value={formData.status} onValueChange={(value) => onChange("status", value)}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">À faire</SelectItem>
              <SelectItem value="in_progress">En cours</SelectItem>
              <SelectItem value="completed">Terminée</SelectItem>
              <SelectItem value="blocked">Bloquée</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="priority">Priorité</Label>
          <Select value={formData.priority} onValueChange={(value) => onChange("priority", value)}>
            <SelectTrigger id="priority">
              <SelectValue placeholder="Sélectionner une priorité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Basse</SelectItem>
              <SelectItem value="medium">Moyenne</SelectItem>
              <SelectItem value="high">Haute</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="assigned_to">Assignée à</Label>
        <Select
          value={formData.assigned_to === null ? "unassigned" : formData.assigned_to}
          onValueChange={(value) => onChange("assigned_to", value)}
        >
          <SelectTrigger id="assigned_to">
            <SelectValue placeholder="Sélectionner un membre de l'équipe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unassigned">Non assignée</SelectItem>
            {teamMembers.map((member) => (
              <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="estimated_hours">Heures estimées</Label>
          <Input
            id="estimated_hours"
            type="number"
            step="0.5"
            min="0"
            value={formData.estimated_hours}
            onChange={(e) => onChange("estimated_hours", e.target.value)}
            placeholder="Ex: 4.5"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="due_date">Date d'échéance</Label>
          <DatePicker date={formData.due_date ?? undefined} setDate={(date) => onChange("due_date", date)} className="w-full" />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? "Mettre à jour" : "Créer la tâche"}
        </Button>
      </div>
    </form>
  )
} 