import { Invoice } from "../invoices/invoice";

export interface Payment {
  id: string;
  invoice_id: string;
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

export interface PaymentActionResult {
  success: boolean;
  error?: string;
  data?: {
    payment?: Payment;
    invoices?: any[];
    payments?: Payment[];
  };
} 