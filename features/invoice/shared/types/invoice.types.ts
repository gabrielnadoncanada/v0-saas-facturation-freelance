import { Client } from '@/features/client/shared/types/client.types';
import { Payment } from '@/features/payment/shared/types/payment.types';

export interface Invoice {
  id: string;
  organization_id?: string;
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
  payments: Payment[];
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

export interface InvoiceDetailsProps {
  invoice: Invoice;
  invoiceItems: InvoiceItem[];
  clients: Client[];
  defaultCurrency: string;
}

export interface InvoiceLinesTableProps {
  invoiceItems: InvoiceItem[];
  currency: string;
}

export interface InvoicePaymentsTableProps {
  payments: Payment[];
  currency: string;
}

export interface InvoiceFormProps {
  clients: Client[];
  invoice?: Invoice;
  invoiceItems?: InvoiceItem[];
  defaultCurrency?: string;
}

export interface SortableInvoiceItemProps {
  item: InvoiceItem;
  index: number;
  handleItemChange: (index: number, name: string, value: any) => void;
  removeItem: (index: number) => void;
  currency: string;
  isLast: boolean;
  userId: string | undefined;
  globalTaxRate: number;
}
