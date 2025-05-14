"use server"
import { createClient } from '@/lib/supabase/server';
import { TaskActionResult } from '@/types/tasks/task';

export async function getTaskFormDataAction(projectId: string): Promise<TaskActionResult> {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        return { success: false, error: "Non authentifié" };
    }
    // Récupérer les détails du projet
    const { data: project, error: projectError } = await supabase
        .from("projects")
        .select("*, clients(name)")
        .eq("id", projectId)
        .eq("user_id", session.user.id)
        .single();
    if (projectError || !project) {
        return { success: false, error: projectError?.message || "Projet non trouvé" };
    }
    // Récupérer les membres de l'équipe (pour l'instant, seulement l'utilisateur actuel)
    const { data: teamMembers, error: teamError } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .eq("id", session.user.id);
    if (teamError) {
        return { success: false, error: teamError.message };
    }
    return { success: true, project, teamMembers: teamMembers || [] };
} 