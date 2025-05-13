"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Récupérer les détails complets d'un projet
export async function getProjectDetails(projectId: string) {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return {
      success: false,
      error: "Non authentifié",
    }
  }

  try {
    // Récupérer les détails du projet
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("*, clients(name)")
      .eq("id", projectId)
      .eq("user_id", session.user.id)
      .single()

    if (projectError || !project) {
      return {
        success: false,
        error: projectError?.message || "Projet non trouvé",
      }
    }

    // Récupérer les tâches du projet
    const { data: tasks, error: tasksError } = await supabase
      .from("tasks")
      .select("*")
      .eq("project_id", projectId)
      .order("status", { ascending: true })
      .order("due_date", { ascending: true, nullsLast: true })

    if (tasksError) {
      console.error("Erreur lors de la récupération des tâches:", tasksError)
    }

    // Récupérer les entrées de temps pour ce projet
    const { data: timeEntries, error: timeError } = await supabase
      .from("time_entries")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("client_id", project.client_id)
      .is("task_id", null)
      .order("start_time", { ascending: false })

    if (timeError) {
      console.error("Erreur lors de la récupération des entrées de temps:", timeError)
    }

    // Récupérer les entrées de temps liées aux tâches de ce projet
    const { data: taskTimeEntries, error: taskTimeError } = await supabase
      .from("time_entries")
      .select("*")
      .in("task_id", tasks?.map((task) => task.id) || [])
      .order("start_time", { ascending: false })

    if (taskTimeError) {
      console.error("Erreur lors de la récupération des entrées de temps des tâches:", taskTimeError)
    }

    // Combiner toutes les entrées de temps
    const allTimeEntries = [...(timeEntries || []), ...(taskTimeEntries || [])]

    // Récupérer les membres de l'équipe (pour l'instant, seulement l'utilisateur actuel)
    const { data: teamMembers, error: teamError } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .eq("id", session.user.id)

    if (teamError) {
      console.error("Erreur lors de la récupération des membres de l'équipe:", teamError)
    }

    return {
      success: true,
      project,
      tasks: tasks || [],
      timeEntries: allTimeEntries,
      userId: session.user.id,
      teamMembers: teamMembers || [],
    }
  } catch (error) {
    return {
      success: false,
      error: "Une erreur est survenue lors de la récupération des données",
    }
  }
}

export async function getAllProjects() {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return {
      success: false,
      error: "Non authentifié",
      data: null,
    }
  }

  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*, clients(name)")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching projects:", error)
      return { success: false, error: error.message, data: null }
    }

    return { success: true, error: null, data }
  } catch (error) {
    console.error("Error in getAllProjects:", error)
    return { success: false, error: "Une erreur est survenue", data: null }
  }
}

export async function createProject(formData: any) {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return {
      success: false,
      error: "Non authentifié",
    }
  }

  try {
    const { data, error } = await supabase
      .from("projects")
      .insert({
        user_id: session.user.id,
        name: formData.name,
        description: formData.description,
        client_id: formData.client_id,
        status: formData.status,
        start_date: formData.start_date,
        end_date: formData.end_date,
        budget: formData.budget,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()

    if (error) {
      console.error("Error creating project:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data: data[0] }
  } catch (error) {
    console.error("Error in createProject:", error)
    return { success: false, error: "Une erreur est survenue lors de la création du projet" }
  }
}

export async function updateProject(id: string, formData: any) {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return {
      success: false,
      error: "Non authentifié",
    }
  }

  try {
    const { error } = await supabase
      .from("projects")
      .update({
        name: formData.name,
        description: formData.description,
        client_id: formData.client_id,
        status: formData.status,
        start_date: formData.start_date,
        end_date: formData.end_date,
        budget: formData.budget,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", session.user.id)

    if (error) {
      console.error("Error updating project:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in updateProject:", error)
    return { success: false, error: "Une erreur est survenue lors de la mise à jour du projet" }
  }
}

export async function deleteProject(id: string) {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return {
      success: false,
      error: "Non authentifié",
    }
  }

  try {
    // First, verify that the project belongs to the user
    const { data: project, error: fetchError } = await supabase
      .from("projects")
      .select("id")
      .eq("id", id)
      .eq("user_id", session.user.id)
      .single()

    if (fetchError || !project) {
      console.error("Error fetching project or project not found:", fetchError)
      return {
        success: false,
        error: fetchError?.message || "Projet non trouvé ou vous n'avez pas les droits nécessaires",
      }
    }

    // Delete the project
    const { error: deleteError } = await supabase.from("projects").delete().eq("id", id).eq("user_id", session.user.id)

    if (deleteError) {
      console.error("Error deleting project:", deleteError)
      return { success: false, error: deleteError.message }
    }

    // Revalidate the projects page to refresh the data
    revalidatePath("/dashboard/projects")

    return { success: true }
  } catch (error) {
    console.error("Error in deleteProject:", error)
    return { success: false, error: "Une erreur est survenue lors de la suppression du projet" }
  }
}

export async function getClients() {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return {
      success: false,
      error: "Non authentifié",
      data: null,
    }
  }

  try {
    const { data, error } = await supabase
      .from("clients")
      .select("id, name")
      .eq("user_id", session.user.id)
      .order("name", { ascending: true })

    if (error) {
      console.error("Error fetching clients:", error)
      return { success: false, error: error.message, data: null }
    }

    return { success: true, error: null, data }
  } catch (error) {
    console.error("Error in getClients:", error)
    return { success: false, error: "Une erreur est survenue", data: null }
  }
}

export async function getProjectData(id?: string) {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return {
      success: false,
      error: "Non authentifié",
      data: null,
    }
  }

  try {
    // Get clients for the form
    const { data: clients, error: clientsError } = await supabase
      .from("clients")
      .select("id, name")
      .eq("user_id", session.user.id)
      .order("name", { ascending: true })

    if (clientsError) {
      console.error("Error fetching clients:", clientsError)
      return { success: false, error: clientsError.message, data: null }
    }

    // If editing, get the project data
    let project = null
    if (id) {
      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .eq("user_id", session.user.id)
        .single()

      if (projectError) {
        console.error("Error fetching project:", projectError)
        return { success: false, error: projectError.message, data: null }
      }

      project = projectData
    }

    return {
      success: true,
      error: null,
      data: {
        clients: clients || [],
        project,
        userId: session.user.id,
      },
    }
  } catch (error) {
    console.error("Error in getProjectData:", error)
    return { success: false, error: "Une erreur est survenue", data: null }
  }
}
