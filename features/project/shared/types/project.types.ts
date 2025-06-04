import { Task } from '@/features/task/shared/types/task.types';
import { Client } from '@/features/client/shared/types/client.types';

export interface Project {
  id: string;
  organization_id?: string;
  name: string;
  description?: string;
  client: Client;
  status: string;
  start_date?: string;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
  tasks: Task[];
}

export interface ProjectFormData {
  name: string;
  description?: string;
  client_id: string;
  status: string;
  start_date?: string;
  end_date?: string;
}
