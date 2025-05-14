"use server"
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from "next/cache";

export async function updateTaskAction(taskId: string, formData: any) {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        return { success: false, error: "Non authentifié" };
    }
    // Récupérer la tâche pour vérifier qu'elle appartient à un projet de l'utilisateur
    const { data: task, error: taskError } = await supabase.from("tasks").select("project_id").eq("id", taskId).single();
    if (taskError || !task) {
        return { success: false, error: "Tâche non trouvée" };
    }
    // Vérifier que le projet appartient à l'utilisateur
    const { data: project, error: projectError } = await supabase
        .from("projects")
        .select("id")
        .eq("id", task.project_id)
        .eq("user_id", session.user.id)
        .single();
    if (projectError || !project) {
        return { success: false, error: "Projet non trouvé ou non autorisé" };
    }
    // Mettre à jour la tâche
    const { error: updateError } = await supabase.from("tasks").update(formData).eq("id", taskId);
    if (updateError) {
        return { success: false, error: updateError.message };
    }
    revalidatePath(`/dashboard/projects/${task.project_id}`);
    return { success: true };
} 