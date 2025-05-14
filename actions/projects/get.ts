"use server"
import { createClient } from '@/lib/supabase/server';
import { Project, ProjectActionResult } from '@/types/projects/project';

export async function getProjectAction(projectId: string): Promise<ProjectActionResult> {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        return { success: false, error: "Non authentifié", data: null };
    }
    // Récupérer les détails du projet
    const { data: project, error: projectError } = await supabase
        .from("projects")
        .select("*, clients(name)")
        .eq("id", projectId)
        .eq("user_id", session.user.id)
        .single();
    if (projectError || !project) {
        return { success: false, error: projectError?.message || "Projet non trouvé", data: null };
    }
    // Récupérer les tâches du projet
    const { data: tasks, error: tasksError } = await supabase
        .from("tasks")
        .select("*")
        .eq("project_id", projectId)
        .order("status", { ascending: true })
        .order("due_date", { ascending: true });
    // Récupérer les entrées de temps pour ce projet
    const { data: timeEntries, error: timeError } = await supabase
        .from("time_entries")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("client_id", project.client_id)
        .is("task_id", null)
        .order("start_time", { ascending: false });
    // Récupérer les entrées de temps liées aux tâches de ce projet
    const { data: taskTimeEntries, error: taskTimeError } = await supabase
        .from("time_entries")
        .select("*")
        .in("task_id", tasks?.map((task) => task.id) || [])
        .order("start_time", { ascending: false });
    // Récupérer les membres de l'équipe (pour l'instant, seulement l'utilisateur actuel)
    const { data: teamMembers, error: teamError } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .eq("id", session.user.id);
    return {
        success: true,
        error: undefined,
        data: {
            project: project as Project,
            tasks: tasks || [],
            timeEntries: [...(timeEntries || []), ...(taskTimeEntries || [])],
            userId: session.user.id,
            teamMembers: teamMembers || [],
        }
    };
} 