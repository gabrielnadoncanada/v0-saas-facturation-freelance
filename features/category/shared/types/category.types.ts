export interface Category {
  id: string;
  organization_id?: string;
  name: string;
  description: string;
  color: string;
  products_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryFormData {
  name: string;
  description: string;
  color: string;
}
