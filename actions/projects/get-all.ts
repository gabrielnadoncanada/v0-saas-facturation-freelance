"use server"
import { createClient } from '@/lib/supabase/server';
import { Project, ProjectActionResult } from '@/types/projects/project';

export async function getAllProjectsAction(): Promise<ProjectActionResult> {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        return { success: false, error: "Non authentifié", data: null };
    }
    const { data, error } = await supabase
        .from("projects")
        .select("*, clients(name)")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
    if (error) {
        return { success: false, error: error.message, data: null };
    }
    return { success: true, error: undefined, data: data as Project[] };
} 