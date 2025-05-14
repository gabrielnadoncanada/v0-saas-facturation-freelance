"use server"
import { createClient } from '@/lib/supabase/server';
import { ProjectFormData, ProjectActionResult } from '@/types/projects/project';

export async function createProjectAction(formData: ProjectFormData): Promise<ProjectActionResult> {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        return { success: false, error: "Non authentifié" };
    }
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
        .select();
    if (error) {
        return { success: false, error: error.message };
    }
    return { success: true, data: data[0] };
} 