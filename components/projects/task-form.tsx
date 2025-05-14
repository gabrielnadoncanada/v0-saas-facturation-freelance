"use client"

import type React from "react"

import { useState } from "react"
import { createTaskAction } from "@/actions/tasks/create"
import { updateTaskAction } from "@/actions/tasks/update"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Task } from "@/types/tasks/task"


export function TaskForm({ projectId, task, teamMembers = [], onSuccess }: { projectId: string, task: Task, teamMembers: TeamMember[], onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: task?.name || "",
    description: task?.description || "",
    status: task?.status || "pending",
    priority: task?.priority || "medium",
    estimated_hours: task?.estimated_hours || "",
    due_date: task?.due_date ? new Date(task.due_date) : null,
    assigned_to: task?.assigned_to || null,
  })

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Préparer les données à soumettre
      const dataToSubmit = {
        ...formData,
        due_date: formData.due_date ? formData.due_date.toISOString().split("T")[0] : null,
        estimated_hours: formData.estimated_hours ? Number(formData.estimated_hours) : null,
        // Si assigned_to est "unassigned" ou une valeur falsy, on met null
        assigned_to: formData.assigned_to === "unassigned" ? null : formData.assigned_to || null,
      }

      let result

      if (task) {
        // Mettre à jour une tâche existante
        result = await updateTaskAction(task.id, dataToSubmit)
      } else {
        // Créer une nouvelle tâche
        result = await createTaskAction(projectId, dataToSubmit)
      }

      if (!result.success) {
        setError(result.error)
        return
      }

      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      console.error("Erreur inattendue:", err)
      setError("Une erreur est survenue lors de la soumission du formulaire")
    } finally {
      setIsLoading(false)
    }
  }

  // Fonction pour obtenir les initiales d'un nom
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Nom de la tâche *</Label>
        <Input id="name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={3}
          placeholder="Décrivez la tâche en détail..."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
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
          <Select value={formData.priority} onValueChange={(value) => handleChange("priority", value)}>
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
          onValueChange={(value) => handleChange("assigned_to", value)}
        >
          <SelectTrigger id="assigned_to">
            <SelectValue placeholder="Sélectionner un membre de l'équipe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unassigned">Non assignée</SelectItem>
            {teamMembers.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                <div className="flex items-center">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarFallback>{member.full_name ? getInitials(member.full_name) : "U"}</AvatarFallback>
                  </Avatar>
                  {member.full_name || member.email}
                </div>
              </SelectItem>
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
            onChange={(e) => handleChange("estimated_hours", e.target.value)}
            placeholder="Ex: 4.5"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="due_date">Date d'échéance</Label>
          <DatePicker date={formData.due_date} setDate={(date) => handleChange("due_date", date)} className="w-full" />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {task ? "Mettre à jour" : "Créer la tâche"}
        </Button>
      </div>
    </form>
  )
}
