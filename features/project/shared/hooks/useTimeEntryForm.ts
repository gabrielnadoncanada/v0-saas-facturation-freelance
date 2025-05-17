import { useState } from "react"
import { createClient } from "@/shared/lib/supabase/client"

export async function useTimeEntryForm({ tasks, clientId, initialTaskId, onSuccess }: {
  tasks: any[],
  clientId: string,
  initialTaskId?: string,
  onSuccess?: () => void,
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    task_id: initialTaskId || "",
    description: "",
    start_time: new Date(),
    end_time: new Date(new Date().getTime() + 60 * 60 * 1000),
    hourly_rate: 0,
    billable: true,
  })

  // Récupérer le taux horaire du client
  const fetchHourlyRate = async (taskId: string) => {
    if (!taskId) return
    const selectedTask = tasks.find((task) => task.id === taskId)
    if (!selectedTask) return
    const { data } = await supabase.from("clients").select("hourly_rate").eq("id", clientId).single()
    if (data?.hourly_rate) {
      setFormData((prev) => ({ ...prev, hourly_rate: data.hourly_rate }))
    } else {
      const { data: userData } = await supabase.from("profiles").select("default_hourly_rate").eq("id", userId).single()
      setFormData((prev) => ({ ...prev, hourly_rate: userData?.default_hourly_rate || 0 }))
    }
  }

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (name === "task_id") {
      fetchHourlyRate(value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    if (!user?.id || !formData.task_id) {
      setError("Informations manquantes")
      setIsLoading(false)
      return
    }
    try {
      const startTime = new Date(formData.start_time)
      const endTime = new Date(formData.end_time)
      const durationInSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000)
      if (durationInSeconds <= 0) {
        setError("La date de fin doit être postérieure à la date de début")
        setIsLoading(false)
        return
      }
      const { error: insertError } = await supabase.from("time_entries").insert({
        user_id: user.id,
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

  return {
    formData,
    handleChange,
    handleSubmit,
    isLoading,
    error,
    setError,
  }
} 