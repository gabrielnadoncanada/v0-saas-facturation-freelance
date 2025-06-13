export interface OrganizationSettings {
  id: string;
  organization_id: string;
  default_currency: string;
  default_tax_rate: number;
  invoice_prefix: string;
  invoice_number_format: string;
  next_invoice_number: number;
  default_payment_terms: number; // days
  late_fee_percentage: number;
  company_address: string;
  company_city: string;
  company_postal_code: string;
  company_country: string;
  company_phone: string;
  company_email: string;
  company_website: string;
  company_tax_number: string;
  created_at: string;
  updated_at: string;
}

export interface OrganizationSettingsFormData {
  default_currency: string;
  default_tax_rate: number;
  invoice_prefix: string;
  invoice_number_format: string;
  next_invoice_number: number;
  default_payment_terms: number;
  late_fee_percentage: number;
  company_address: string;
  company_city: string;
  company_postal_code: string;
  company_country: string;
  company_phone: string;
  company_email: string;
  company_website: string;
  company_tax_number: string;
} 