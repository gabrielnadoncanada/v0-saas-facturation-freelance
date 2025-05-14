"use server"
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from "next/cache";
import { ProjectActionResult } from '@/types/projects/project';

export async function deleteProjectAction(projectId: string): Promise<ProjectActionResult> {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        return { success: false, error: "Non authentifié" };
    }
    // Vérifier que le projet appartient à l'utilisateur
    const { data: project, error: fetchError } = await supabase
        .from("projects")
        .select("id")
        .eq("id", projectId)
        .eq("user_id", session.user.id)
        .single();
    if (fetchError || !project) {
        return { success: false, error: fetchError?.message || "Projet non trouvé ou vous n'avez pas les droits nécessaires" };
    }
    // Supprimer le projet
    const { error: deleteError } = await supabase.from("projects").delete().eq("id", projectId).eq("user_id", session.user.id);
    if (deleteError) {
        return { success: false, error: deleteError.message };
    }
    revalidatePath("/dashboard/projects");
    return { success: true };
} 