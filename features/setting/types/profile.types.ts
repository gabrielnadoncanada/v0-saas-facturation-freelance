export interface UserProfile {
  id: string;
  name: string;
  email: string;
  company_name?: string;
  address?: string;
  phone?: string;
  default_currency?: string;
  tax_rate?: number;
  tax_id?: string;
  website?: string;
  logo_url?: string;
}

export interface UserProfileFormData {
  name: string;
  email: string;
  company_name?: string;
  address?: string;
  phone?: string;
  default_currency?: string;
  tax_rate?: number;
  tax_id?: string;
  website?: string;
}
