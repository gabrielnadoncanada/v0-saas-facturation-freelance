export interface Project {
  id: string;
  user_id?: string;
  name: string;
  description?: string;
  client_id: string;
  status: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectFormData {
  name: string;
  description?: string;
  client_id: string;
  status: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
}

export interface ProjectDetailsResult {
  project: Project;
  tasks: any[];
  timeEntries: any[];
  userId: string;
  teamMembers: any[];
}

export interface ProjectActionResult {
  success: boolean;
  error?: string;
  data?: Project | Project[] | ProjectDetailsResult | null;
} 