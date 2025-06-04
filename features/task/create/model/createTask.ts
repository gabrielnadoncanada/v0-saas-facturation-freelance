import { getSessionUser } from '@/shared/utils/getSessionUser';
import { Task, TaskFormData } from '@/features/task/shared/types/task.types';
import { fetchList, insertRecord } from '@/shared/services/supabase/crud';

export async function createTask(projectId: string, formData: TaskFormData): Promise<Task> {
  const { supabase, user } = await getSessionUser();

  // Vérifier que le projet appartient à l'utilisateur
  const projects = await fetchList(supabase, 'projects', 'id', { id: projectId, user_id: user.id });

  if (!projects.length) {
    throw new Error('Projet non trouvé ou non autorisé');
  }

  // Créer la tâche
  return await insertRecord<Task>(supabase, 'tasks', { ...formData, project_id: projectId });
}
