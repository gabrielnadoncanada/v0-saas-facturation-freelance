export interface Product {
  id?: string;
  organization_id?: string;
  name: string;
  description: string;
  price: number;
  tax_rate: number;
  is_service: boolean;
  category_id: string | null;
  created_at?: string;
  updated_at?: string;
}
