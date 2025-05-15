export interface Category {
  id: string;
  user_id?: string;
  name: string;
  description: string;
  color: string;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryFormData {
  name: string;
  description: string;
  color: string;
}

export interface CategoryActionResult {
  success: boolean;
  error?: string;
  data?: Category | Category[] | null;
} 