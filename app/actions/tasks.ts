"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Récupérer les données nécessaires pour créer une tâche
export async function getTaskFormData(projectId: string) {
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

    // Récupérer les membres de l'équipe (pour l'assignation des tâches)
    // Pour l'instant, nous n'avons que l'utilisateur actuel
    const { data: teamMembers, error: teamError } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .eq("id", session.user.id)

    if (teamError) {
      console.error("Erreur lors de la récupération des membres de l'équipe:", teamError)
      return {
        success: false,
        error: teamError.message,
      }
    }

    return {
      success: true,
      project,
      teamMembers: teamMembers || [],
    }
  } catch (error) {
    return {
      success: false,
      error: "Une erreur est survenue lors de la récupération des données",
    }
  }
}

// Créer une nouvelle tâche
export async function createTask(projectId: string, formData: any) {
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
    // Vérifier que le projet appartient à l'utilisateur
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id")
      .eq("id", projectId)
      .eq("user_id", session.user.id)
      .single()

    if (projectError || !project) {
      return {
        success: false,
        error: "Projet non trouvé ou non autorisé",
      }
    }

    // Créer la tâche
    const { data, error: insertError } = await supabase
      .from("tasks")
      .insert({
        ...formData,
        project_id: projectId,
      })
      .select()

    if (insertError) {
      return {
        success: false,
        error: insertError.message,
      }
    }

    revalidatePath(`/dashboard/projects/${projectId}`)
    return {
      success: true,
      task: data?.[0],
    }
  } catch (error) {
    return {
      success: false,
      error: "Une erreur est survenue lors de la création de la tâche",
    }
  }
}

// Mettre à jour une tâche existante
export async function updateTask(taskId: string, formData: any) {
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
    // Récupérer la tâche pour vérifier qu'elle appartient à un projet de l'utilisateur
    const { data: task, error: taskError } = await supabase.from("tasks").select("project_id").eq("id", taskId).single()

    if (taskError || !task) {
      return {
        success: false,
        error: "Tâche non trouvée",
      }
    }

    // Vérifier que le projet appartient à l'utilisateur
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id")
      .eq("id", task.project_id)
      .eq("user_id", session.user.id)
      .single()

    if (projectError || !project) {
      return {
        success: false,
        error: "Projet non trouvé ou non autorisé",
      }
    }

    // Mettre à jour la tâche
    const { error: updateError } = await supabase.from("tasks").update(formData).eq("id", taskId)

    if (updateError) {
      return {
        success: false,
        error: updateError.message,
      }
    }

    revalidatePath(`/dashboard/projects/${task.project_id}`)
    return {
      success: true,
    }
  } catch (error) {
    return {
      success: false,
      error: "Une erreur est survenue lors de la mise à jour de la tâche",
    }
  }
}

// Supprimer une tâche
export async function deleteTask(taskId: string) {
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
    // Récupérer la tâche pour vérifier qu'elle appartient à un projet de l'utilisateur
    const { data: task, error: taskError } = await supabase.from("tasks").select("project_id").eq("id", taskId).single()

    if (taskError || !task) {
      return {
        success: false,
        error: "Tâche non trouvée",
      }
    }

    // Vérifier que le projet appartient à l'utilisateur
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id")
      .eq("id", task.project_id)
      .eq("user_id", session.user.id)
      .single()

    if (projectError || !project) {
      return {
        success: false,
        error: "Projet non trouvé ou non autorisé",
      }
    }

    // Supprimer la tâche
    const { error: deleteError } = await supabase.from("tasks").delete().eq("id", taskId)

    if (deleteError) {
      return {
        success: false,
        error: deleteError.message,
      }
    }

    revalidatePath(`/dashboard/projects/${task.project_id}`)
    return {
      success: true,
    }
  } catch (error) {
    return {
      success: false,
      error: "Une erreur est survenue lors de la suppression de la tâche",
    }
  }
}
