"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { createProject, updateProject } from "@/app/actions/projects"

interface ProjectFormProps {
  userId: string | undefined
  clients: { id: string; name: string }[]
  project?: any
}

export function ProjectForm({ userId, clients, project }: ProjectFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    client_id: project?.client_id || "",
    name: project?.name || "",
    description: project?.description || "",
    status: project?.status || "active",
    start_date: project?.start_date ? new Date(project.start_date) : null,
    end_date: project?.end_date ? new Date(project.end_date) : null,
    budget: project?.budget || "",
  })

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!userId || !formData.client_id) {
      setError("Informations manquantes")
      setIsLoading(false)
      return
    }

    try {
      const dataToSubmit = {
        ...formData,
        user_id: userId,
        start_date: formData.start_date ? formData.start_date.toISOString().split("T")[0] : null,
        end_date: formData.end_date ? formData.end_date.toISOString().split("T")[0] : null,
        budget: formData.budget ? Number(formData.budget) : null,
      }

      let result

      if (project) {
        // Mettre à jour un projet existant
        result = await updateProject(project.id, dataToSubmit)
      } else {
        // Créer un nouveau projet
        result = await createProject(dataToSubmit)
      }

      if (!result.success) {
        setError(result.error || "Une erreur est survenue")
        return
      }

      router.push("/dashboard/projects")
      router.refresh()
    } catch (err) {
      setError("Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Informations du projet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du projet *</Label>
            <Input id="name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client_id">Client *</Label>
            <Select value={formData.client_id} onValueChange={(value) => handleChange("client_id", value)} required>
              <SelectTrigger id="client_id">
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
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
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                  <SelectItem value="on_hold">En pause</SelectItem>
                  <SelectItem value="cancelled">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Budget (€)</Label>
              <Input
                id="budget"
                type="number"
                step="0.01"
                min="0"
                value={formData.budget}
                onChange={(e) => handleChange("budget", e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start_date">Date de début</Label>
              <DatePicker
                date={formData.start_date}
                setDate={(date) => handleChange("start_date", date)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">Date de fin</Label>
              <DatePicker
                date={formData.end_date}
                setDate={(date) => handleChange("end_date", date)}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.push("/dashboard/projects")}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {project ? "Mettre à jour" : "Créer le projet"}
        </Button>
      </div>
    </form>
  )
}
