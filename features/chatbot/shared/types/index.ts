export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatError {
  message: string;
  code?: string;
}

export interface InvoiceData {
  id: string;
  invoice_number: string;
  status: "draft" | "sent" | "paid" | "overdue";
  total_amount: number;
  due_date: string;
  created_at: string;
  client?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ClientData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  created_at: string;
}

export interface ProjectData {
  id: string;
  name: string;
  description?: string;
  status: "active" | "completed" | "on_hold";
  start_date?: string;
  end_date?: string;
  created_at: string;
  client?: {
    id: string;
    name: string;
    email: string;
  };
} 