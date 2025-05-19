import { Invoice } from "@/features/invoice/shared/types/invoice.types";

export interface Payment {
  id: string;
  invoice_id: string;
  invoice_number: string;
  client_name: string;
  amount: number;
  payment_date: Date | string;
  payment_method: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  invoice: Invoice;
}

export interface PaymentFormData {
  invoice_id: string;
  amount: number;
  payment_date: Date;
  payment_method: string;
  notes: string;
}