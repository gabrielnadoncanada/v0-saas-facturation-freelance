"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { DateTimePicker } from "@/components/ui/date-time-picker"



export function TimeEntryForm({ tasks, userId, clientId, initialTaskId, onSuccess }: TimeEntryFormProps) {
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    task_id: initialTaskId || "",
    description: "",
    start_time: new Date(),
    end_time: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 heure plus tard par défaut
    hourly_rate: 0,
    billable: true,
  })

  // Récupérer le taux horaire du client
  const fetchHourlyRate = async (taskId: string) => {
    if (!taskId) return

    // Trouver la tâche sélectionnée
    const selectedTask = tasks.find((task) => task.id === taskId)
    if (!selectedTask) return

    // Récupérer le taux horaire du client
    const { data } = await supabase.from("clients").select("hourly_rate").eq("id", clientId).single()

    if (data?.hourly_rate) {
      setFormData((prev) => ({ ...prev, hourly_rate: data.hourly_rate }))
    } else {
      // Si le client n'a pas de taux horaire, récupérer le taux par défaut de l'utilisateur
      const { data: userData } = await supabase.from("profiles").select("default_hourly_rate").eq("id", userId).single()

      setFormData((prev) => ({ ...prev, hourly_rate: userData?.default_hourly_rate || 0 }))
    }
  }

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Si la tâche change, mettre à jour le taux horaire
    if (name === "task_id") {
      fetchHourlyRate(value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!userId || !formData.task_id) {
      setError("Informations manquantes")
      setIsLoading(false)
      return
    }

    try {
      // Calculer la durée en secondes
      const startTime = new Date(formData.start_time)
      const endTime = new Date(formData.end_time)
      const durationInSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000)

      if (durationInSeconds <= 0) {
        setError("La date de fin doit être postérieure à la date de début")
        setIsLoading(false)
        return
      }

      const { error: insertError } = await supabase.from("time_entries").insert({
        user_id: userId,
        client_id: clientId,
        task_id: formData.task_id,
        description: formData.description,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        duration: durationInSeconds,
        hourly_rate: formData.hourly_rate,
        billable: formData.billable,
        billed: false,
      })

      if (insertError) {
        setError(insertError.message)
        return
      }

      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      setError("Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
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
        <Label htmlFor="task_id">Tâche *</Label>
        <Select value={formData.task_id} onValueChange={(value) => handleChange("task_id", value)} required>
          <SelectTrigger id="task_id">
            <SelectValue placeholder="Sélectionner une tâche" />
          </SelectTrigger>
          <SelectContent>
            {tasks.map((task) => (
              <SelectItem key={task.id} value={task.id}>
                {task.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          required
          rows={2}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="start_time">Date et heure de début</Label>
          <DateTimePicker date={formData.start_time} setDate={(date) => handleChange("start_time", date)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_time">Date et heure de fin</Label>
          <DateTimePicker date={formData.end_time} setDate={(date) => handleChange("end_time", date)} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="hourly_rate">Taux horaire (€)</Label>
          <Input
            id="hourly_rate"
            type="number"
            step="0.01"
            min="0"
            value={formData.hourly_rate}
            onChange={(e) => handleChange("hourly_rate", Number(e.target.value))}
            required
          />
        </div>
        <div className="flex items-center space-x-2 pt-8">
          <Switch
            id="billable"
            checked={formData.billable}
            onCheckedChange={(checked) => handleChange("billable", checked)}
          />
          <Label htmlFor="billable">Facturable</Label>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Enregistrer
        </Button>
      </div>
    </form>
  )
}
