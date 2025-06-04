export interface DbNotification {
  id: string;
  organization_id: string;
  title: string;
  description: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface NotificationFormData {
  title: string;
  description: string;
  type: 'info' | 'success' | 'warning' | 'error';
}
