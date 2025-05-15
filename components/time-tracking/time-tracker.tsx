"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/shared/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Pause, StopCircle } from "lucide-react"
import { formatDuration } from "@/shared/lib/utils"

interface Client {
  id: string
  name: string
}

interface Project {
  id: string
  name: string
}

interface Task {
  id: string
  name: string
}

interface TimeTrackerProps {
  clients: Client[]
  userId: string | undefined
}

export function TimeTracker({ clients, userId }: TimeTrackerProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isTracking, setIsTracking] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [description, setDescription] = useState("")
  const [selectedClient, setSelectedClient] = useState<string>("")
  const [selectedProject, setSelectedProject] = useState<string>("")
  const [selectedTask, setSelectedTask] = useState<string>("")
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [hourlyRate, setHourlyRate] = useState<number | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [pauseTime, setPauseTime] = useState<Date | null>(null)
  const [pausedDuration, setPausedDuration] = useState(0)

  // Check for active time entry on component mount
  useEffect(() => {
    const checkActiveTimeEntry = async () => {
      if (!userId) return

      const { data } = await supabase
        .from("time_entries")
        .select("*, clients(hourly_rate), tasks(id, name, project_id), tasks!inner(projects(id, name))")
        .eq("user_id", userId)
        .is("end_time", null)
        .single()

      if (data) {
        // Resume tracking
        setIsTracking(true)
        setDescription(data.description)
        setSelectedClient(data.client_id)
        setHourlyRate(data.hourly_rate)

        if (data.task_id) {
          setSelectedTask(data.task_id)

          // Récupérer le projet associé à la tâche
          if (data.tasks?.project_id) {
            setSelectedProject(data.tasks.project_id)

            // Charger les projets du client
            const { data: projectsData } = await supabase
              .from("projects")
              .select("id, name")
              .eq("client_id", data.client_id)
              .order("name", { ascending: true })

            setProjects(projectsData || [])

            // Charger les tâches du projet
            const { data: tasksData } = await supabase
              .from("tasks")
              .select("id, name")
              .eq("project_id", data.tasks.project_id)
              .order("name", { ascending: true })

            setTasks(tasksData || [])
          }
        }

        const start = new Date(data.start_time)
        setStartTime(start)

        // Calculate elapsed time
        const now = new Date()
        const elapsed = Math.floor((now.getTime() - start.getTime()) / 1000)
        setElapsedTime(elapsed)
      }
    }

    checkActiveTimeEntry()
  }, [userId, supabase])

  // Update elapsed time every second when tracking
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isTracking && !isPaused && startTime) {
      interval = setInterval(() => {
        const now = new Date()
        const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000) - pausedDuration
        setElapsedTime(elapsed)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTracking, isPaused, startTime, pausedDuration])

  // Charger les projets lorsque le client change
  useEffect(() => {
    const fetchProjects = async () => {
      if (!selectedClient) {
        setProjects([])
        setSelectedProject("")
        setTasks([])
        setSelectedTask("")
        return
      }

      const { data } = await supabase
        .from("projects")
        .select("id, name")
        .eq("client_id", selectedClient)
        .eq("status", "active")
        .order("name", { ascending: true })

      setProjects(data || [])
      setSelectedProject("")
      setTasks([])
      setSelectedTask("")
    }

    fetchProjects()
  }, [selectedClient, supabase])

  // Charger les tâches lorsque le projet change
  useEffect(() => {
    const fetchTasks = async () => {
      if (!selectedProject) {
        setTasks([])
        setSelectedTask("")
        return
      }

      const { data } = await supabase
        .from("tasks")
        .select("id, name")
        .eq("project_id", selectedProject)
        .not("status", "eq", "completed")
        .order("name", { ascending: true })

      setTasks(data || [])
      setSelectedTask("")
    }

    fetchTasks()
  }, [selectedProject, supabase])

  // Fetch client's hourly rate when selected
  useEffect(() => {
    const fetchClientRate = async () => {
      if (!selectedClient) {
        setHourlyRate(null)
        return
      }

      const { data } = await supabase.from("clients").select("hourly_rate").eq("id", selectedClient).single()

      if (data?.hourly_rate) {
        setHourlyRate(data.hourly_rate)
      } else {
        // Fetch user's default rate if client has no specific rate
        const { data: userData } = await supabase
          .from("profiles")
          .select("default_hourly_rate")
          .eq("id", userId)
          .single()

        setHourlyRate(userData?.default_hourly_rate || 0)
      }
    }

    fetchClientRate()
  }, [selectedClient, supabase, userId])

  const startTracking = async () => {
    if (!userId || !selectedClient || !description) return

    const now = new Date()
    setStartTime(now)
    setIsTracking(true)
    setElapsedTime(0)
    setPausedDuration(0)

    // Create a new time entry
    await supabase.from("time_entries").insert({
      user_id: userId,
      client_id: selectedClient,
      task_id: selectedTask || null,
      description,
      start_time: now.toISOString(),
      hourly_rate: hourlyRate || 0,
    })
  }

  const pauseTracking = () => {
    setIsPaused(true)
    setPauseTime(new Date())
  }

  const resumeTracking = () => {
    if (pauseTime) {
      const now = new Date()
      const pauseDuration = Math.floor((now.getTime() - pauseTime.getTime()) / 1000)
      setPausedDuration(pausedDuration + pauseDuration)
    }
    setIsPaused(false)
    setPauseTime(null)
  }

  const stopTracking = async () => {
    if (!userId || !startTime) return

    const now = new Date()
    const finalElapsedTime = Math.floor((now.getTime() - startTime.getTime()) / 1000) - pausedDuration

    // Update the time entry with end time and duration
    const { data } = await supabase
      .from("time_entries")
      .select("id")
      .eq("user_id", userId)
      .is("end_time", null)
      .single()

    if (data) {
      await supabase
        .from("time_entries")
        .update({
          end_time: now.toISOString(),
          duration: finalElapsedTime,
        })
        .eq("id", data.id)
    }

    // Reset state
    setIsTracking(false)
    setIsPaused(false)
    setElapsedTime(0)
    setStartTime(null)
    setPauseTime(null)
    setPausedDuration(0)

    // Refresh the page to show the new entry
    router.refresh()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Suivi du temps</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="client">Client</Label>
            <Select value={selectedClient} onValueChange={setSelectedClient} disabled={isTracking}>
              <SelectTrigger id="client">
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
            <Label htmlFor="project">Projet</Label>
            <Select
              value={selectedProject}
              onValueChange={setSelectedProject}
              disabled={isTracking || !selectedClient || projects.length === 0}
            >
              <SelectTrigger id="project">
                <SelectValue
                  placeholder={
                    !selectedClient
                      ? "Sélectionnez d'abord un client"
                      : projects.length === 0
                        ? "Aucun projet actif"
                        : "Sélectionner un projet"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="task">Tâche</Label>
            <Select
              value={selectedTask}
              onValueChange={setSelectedTask}
              disabled={isTracking || !selectedProject || tasks.length === 0}
            >
              <SelectTrigger id="task">
                <SelectValue
                  placeholder={
                    !selectedProject
                      ? "Sélectionnez d'abord un projet"
                      : tasks.length === 0
                        ? "Aucune tâche disponible"
                        : "Sélectionner une tâche"
                  }
                />
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
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Que faites-vous?"
              disabled={isTracking}
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-3xl font-mono">{formatDuration(elapsedTime)}</div>
          <div>
            {hourlyRate !== null && <div className="text-sm text-muted-foreground">Taux: {hourlyRate} €/h</div>}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {!isTracking ? (
          <Button onClick={startTracking} disabled={!selectedClient || !description} className="w-full">
            <Play className="mr-2 h-4 w-4" />
            Démarrer
          </Button>
        ) : (
          <div className="flex w-full gap-2">
            {isPaused ? (
              <Button onClick={resumeTracking} className="flex-1">
                <Play className="mr-2 h-4 w-4" />
                Reprendre
              </Button>
            ) : (
              <Button onClick={pauseTracking} variant="outline" className="flex-1">
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </Button>
            )}
            <Button onClick={stopTracking} variant="destructive" className="flex-1">
              <StopCircle className="mr-2 h-4 w-4" />
              Arrêter
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
