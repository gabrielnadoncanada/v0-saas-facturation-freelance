"use server"
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from "next/cache";
import { TaskActionResult } from '@/types/tasks/task';

export async function deleteTaskAction(taskId: string): Promise<TaskActionResult> {
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
    // Supprimer la tâche
    const { error: deleteError } = await supabase.from("tasks").delete().eq("id", taskId);
    if (deleteError) {
        return { success: false, error: deleteError.message };
    }
    revalidatePath(`/dashboard/projects/${task.project_id}`);
    return { success: true };
} 