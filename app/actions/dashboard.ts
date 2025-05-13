"use server"

import { createClient } from "@/lib/supabase/server"

export async function getDashboardData() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    // Au lieu de rediriger, retournons simplement des données vides
    // Le middleware s'occupera de la redirection
    return {
      invoices: [],
      projects: [],
      tasks: [],
      stats: null,
    }
  }

  // Récupérer toutes les données en parallèle pour optimiser les performances
  const [invoicesResult, projectsResult, tasksResult, statsResult] = await Promise.all([
    // Récupérer les factures récentes
    supabase
      .from("invoices")
      .select("*, clients(name)")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(5),

    // Récupérer les projets
    supabase
      .from("projects")
      .select("*, clients(name)")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(5),

    // Récupérer les tâches à venir
    supabase
      .from("tasks")
      .select("*, projects(name)")
      .in("status", ["pending", "in_progress"])
      .eq("projects.user_id", session.user.id)
      .order("due_date", { ascending: true })
      .limit(5),

    // Récupérer les statistiques de l'utilisateur
    supabase.rpc("get_user_stats", {
      user_id_param: session.user.id,
    }),
  ])

  // Extraire les données des résultats
  const invoices = invoicesResult.data || []
  const projects = projectsResult.data || []
  const tasks = tasksResult.data || []
  const stats = statsResult.data ? statsResult.data[0] : null

  return {
    invoices,
    projects,
    tasks,
    stats,
  }
}
