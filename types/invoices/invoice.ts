import { Client } from "../clients/client";

export interface Invoice {
    id: string;
    user_id?: string;
    client_id: string;
    issue_date: Date | string;
    due_date: Date | string;
    status: string;
    invoice_number: string;
    currency: string;
    language: string;
    notes?: string;
    tax_rate: number;
    subtotal: number;
    tax_total: number;
    total: number;
    created_at?: string;
    updated_at?: string;
    client: Client;
}

export interface InvoiceItem {
    id: string;
    invoice_id: string;
    description: string;
    quantity: number;
    unit_price: number;
    tax_rate: number;
    amount: number;
    position: number;
    isNew?: boolean;
}

export interface InvoiceActionResult {
  success: boolean;
  error?: string;
  data?: any;
}
