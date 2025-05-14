export interface Task {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  status: string;
  due_date?: string;
  assigned_to?: string;
  created_at?: string;
  estimated_hours?: number;
  priority: string;
  updated_at?: string;
}

export interface TaskFormData {
  name: string;
  description?: string;
  status: string;
  due_date?: string;
  assigned_to?: string;
}

export interface TaskActionResult {
  success: boolean;
  error?: string;
  task?: Task;
  tasks?: Task[];
  project?: any;
  teamMembers?: any[];
} 