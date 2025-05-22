export interface TeamMember {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TeamMemberFormData {
  name: string;
  email: string;
  role?: string;
}
