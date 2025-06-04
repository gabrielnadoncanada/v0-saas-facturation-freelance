export interface Client {
  id: string;
  name: string;
  organization_id: string;
  email?: string | null;
  phone?: string | null;
  hourly_rate?: number | null;
  billing_address?: string | null;
  billing_city?: string | null;
  billing_postal_code?: string | null;
  billing_country?: string | null;
  shipping_address?: string | null;
  shipping_city?: string | null;
  shipping_postal_code?: string | null;
  shipping_country?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ClientFormData {
  name: string;
  email?: string;
  phone?: string;
  hourly_rate?: string | number;
  billing_address?: string;
  billing_city?: string;
  billing_postal_code?: string;
  billing_country?: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_postal_code?: string;
  shipping_country?: string;
  notes?: string;
  sameAsShipping?: boolean;
}

