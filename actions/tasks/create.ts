"use server"
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from "next/cache";
import { TaskFormData, TaskActionResult } from '@/types/tasks/task';

export async function createTaskAction(projectId: string, formData: TaskFormData): Promise<TaskActionResult> {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        return { success: false, error: "Non authentifié" };
    }
    // Vérifier que le projet appartient à l'utilisateur
    const { data: project, error: projectError } = await supabase
        .from("projects")
        .select("id")
        .eq("id", projectId)
        .eq("user_id", session.user.id)
        .single();
    if (projectError || !project) {
        return { success: false, error: "Projet non trouvé ou non autorisé" };
    }
    // Créer la tâche
    const { data, error: insertError } = await supabase
        .from("tasks")
        .insert({ ...formData, project_id: projectId })
        .select();
    if (insertError) {
        return { success: false, error: insertError.message };
    }
    revalidatePath(`/dashboard/projects/${projectId}`);
    return { success: true, task: data?.[0] };
} 