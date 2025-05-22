export interface Task {
  id: string;
  project_id: string;
  parent_task_id?: string | null;
  name: string;
  description?: string;
  status: string;
  due_date?: string;
  assigned_to?: string;
  created_at?: string;
  estimated_hours?: number;
  priority: string;
  updated_at?: string;
  subtasks?: Task[];
}

export interface TaskFormData {
  name: string;
  description?: string;
  status: string;
  due_date?: string;
  assigned_to?: string;
}