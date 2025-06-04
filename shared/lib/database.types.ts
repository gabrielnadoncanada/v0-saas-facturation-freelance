export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          billing_address: string | null;
          billing_city: string | null;
          billing_country: string | null;
          billing_postal_code: string | null;
          created_at: string | null;
          email: string | null;
          hourly_rate: number | null;
          id: string;
          name: string;
          notes: string | null;
          organization_id: string;
          phone: string | null;
          shipping_address: string | null;
          shipping_city: string | null;
          shipping_country: string | null;
          shipping_postal_code: string | null;
          updated_at: string | null;
        };
        Insert: {
          billing_address?: string | null;
          billing_city?: string | null;
          billing_country?: string | null;
          billing_postal_code?: string | null;
          created_at?: string | null;
          email?: string | null;
          hourly_rate?: number | null;
          id?: string;
          name: string;
          notes?: string | null;
          organization_id: string;
          phone?: string | null;
          shipping_address?: string | null;
          shipping_city?: string | null;
          shipping_country?: string | null;
          shipping_postal_code?: string | null;
          updated_at?: string | null;
        };
        Update: {
          billing_address?: string | null;
          billing_city?: string | null;
          billing_country?: string | null;
          billing_postal_code?: string | null;
          created_at?: string | null;
          email?: string | null;
          hourly_rate?: number | null;
          id?: string;
          name?: string;
          notes?: string | null;
          organization_id?: string;
          phone?: string | null;
          shipping_address?: string | null;
          shipping_city?: string | null;
          shipping_country?: string | null;
          shipping_postal_code?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'clients_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
      invoice_items: {
        Row: {
          amount: number;
          created_at: string | null;
          description: string;
          id: string;
          invoice_id: string;
          organization_id: string;
          position: number | null;
          quantity: number;
          tax_rate: number;
          time_entry_id: string | null;
          unit_price: number;
          updated_at: string | null;
        };
        Insert: {
          amount?: number;
          created_at?: string | null;
          description: string;
          id?: string;
          invoice_id: string;
          organization_id: string;
          position?: number | null;
          quantity?: number;
          tax_rate?: number;
          time_entry_id?: string | null;
          unit_price?: number;
          updated_at?: string | null;
        };
        Update: {
          amount?: number;
          created_at?: string | null;
          description?: string;
          id?: string;
          invoice_id?: string;
          organization_id?: string;
          position?: number | null;
          quantity?: number;
          tax_rate?: number;
          time_entry_id?: string | null;
          unit_price?: number;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'invoice_items_invoice_id_fkey';
            columns: ['invoice_id'];
            isOneToOne: false;
            referencedRelation: 'invoices';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'invoice_items_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
      invoices: {
        Row: {
          client_id: string;
          created_at: string | null;
          currency: string;
          due_date: string;
          id: string;
          invoice_number: string;
          issue_date: string;
          language: string;
          notes: string | null;
          organization_id: string;
          status: string;
          subtotal: number;
          tax_rate: number | null;
          tax_total: number;
          total: number;
          updated_at: string | null;
        };
        Insert: {
          client_id: string;
          created_at?: string | null;
          currency?: string;
          due_date: string;
          id?: string;
          invoice_number: string;
          issue_date?: string;
          language?: string;
          notes?: string | null;
          organization_id: string;
          status?: string;
          subtotal?: number;
          tax_rate?: number | null;
          tax_total?: number;
          total?: number;
          updated_at?: string | null;
        };
        Update: {
          client_id?: string;
          created_at?: string | null;
          currency?: string;
          due_date?: string;
          id?: string;
          invoice_number?: string;
          issue_date?: string;
          language?: string;
          notes?: string | null;
          organization_id?: string;
          status?: string;
          subtotal?: number;
          tax_rate?: number | null;
          tax_total?: number;
          total?: number;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'invoices_client_id_fkey';
            columns: ['client_id'];
            isOneToOne: false;
            referencedRelation: 'clients';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'invoices_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
      notifications: {
        Row: {
          created_at: string | null;
          data: Json | null;
          id: string;
          message: string;
          organization_id: string;
          read: boolean;
          title: string;
          type: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          data?: Json | null;
          id?: string;
          message: string;
          organization_id: string;
          read?: boolean;
          title: string;
          type: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          data?: Json | null;
          id?: string;
          message?: string;
          organization_id?: string;
          read?: boolean;
          title?: string;
          type?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'notifications_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
      organization_invitations: {
        Row: {
          created_at: string | null;
          email: string;
          expires_at: string;
          id: string;
          organization_id: string;
          role: string;
          token: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          email: string;
          expires_at: string;
          id?: string;
          organization_id: string;
          role?: string;
          token: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string;
          expires_at?: string;
          id?: string;
          organization_id?: string;
          role?: string;
          token?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'organization_invitations_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
      organization_members: {
        Row: {
          created_at: string | null;
          id: string;
          organization_id: string;
          role: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          organization_id: string;
          role?: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          organization_id?: string;
          role?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'organization_members_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
      organizations: {
        Row: {
          created_at: string | null;
          id: string;
          logo_url: string | null;
          name: string;
          owner_id: string;
          plan: string;
          slug: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          logo_url?: string | null;
          name: string;
          owner_id: string;
          plan?: string;
          slug: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          logo_url?: string | null;
          name?: string;
          owner_id?: string;
          plan?: string;
          slug?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      payments: {
        Row: {
          amount: number;
          created_at: string | null;
          id: string;
          invoice_id: string;
          notes: string | null;
          organization_id: string;
          payment_date: string;
          payment_method: string;
          updated_at: string | null;
        };
        Insert: {
          amount: number;
          created_at?: string | null;
          id?: string;
          invoice_id: string;
          notes?: string | null;
          organization_id: string;
          payment_date?: string;
          payment_method: string;
          updated_at?: string | null;
        };
        Update: {
          amount?: number;
          created_at?: string | null;
          id?: string;
          invoice_id?: string;
          notes?: string | null;
          organization_id?: string;
          payment_date?: string;
          payment_method?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'payments_invoice_id_fkey';
            columns: ['invoice_id'];
            isOneToOne: false;
            referencedRelation: 'invoices';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'payments_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
      product_categories: {
        Row: {
          color: string | null;
          created_at: string | null;
          description: string | null;
          id: string;
          name: string;
          organization_id: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          color?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name: string;
          organization_id: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          color?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name?: string;
          organization_id?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'product_categories_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
      products: {
        Row: {
          category_id: string | null;
          created_at: string | null;
          description: string | null;
          id: string;
          is_service: boolean | null;
          name: string;
          organization_id: string;
          price: number;
          tax_rate: number | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          category_id?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          is_service?: boolean | null;
          name: string;
          organization_id: string;
          price: number;
          tax_rate?: number | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          category_id?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          is_service?: boolean | null;
          name?: string;
          organization_id?: string;
          price?: number;
          tax_rate?: number | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'products_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'product_categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'products_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          address: string | null;
          city: string | null;
          company_name: string | null;
          country: string | null;
          created_at: string | null;
          default_currency: string | null;
          default_hourly_rate: number | null;
          email: string;
          full_name: string | null;
          id: string;
          logo_url: string | null;
          organization_id: string | null;
          phone: string | null;
          postal_code: string | null;
          tax_number: string | null;
          updated_at: string | null;
        };
        Insert: {
          address?: string | null;
          city?: string | null;
          company_name?: string | null;
          country?: string | null;
          created_at?: string | null;
          default_currency?: string | null;
          default_hourly_rate?: number | null;
          email: string;
          full_name?: string | null;
          id: string;
          logo_url?: string | null;
          organization_id?: string | null;
          phone?: string | null;
          postal_code?: string | null;
          tax_number?: string | null;
          updated_at?: string | null;
        };
        Update: {
          address?: string | null;
          city?: string | null;
          company_name?: string | null;
          country?: string | null;
          created_at?: string | null;
          default_currency?: string | null;
          default_hourly_rate?: number | null;
          email?: string;
          full_name?: string | null;
          id?: string;
          logo_url?: string | null;
          organization_id?: string | null;
          phone?: string | null;
          postal_code?: string | null;
          tax_number?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
      projects: {
        Row: {
          budget: number | null;
          client_id: string;
          created_at: string | null;
          description: string | null;
          end_date: string | null;
          id: string;
          name: string;
          organization_id: string;
          start_date: string | null;
          status: string;
          updated_at: string | null;
        };
        Insert: {
          budget?: number | null;
          client_id: string;
          created_at?: string | null;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          name: string;
          organization_id: string;
          start_date?: string | null;
          status?: string;
          updated_at?: string | null;
        };
        Update: {
          budget?: number | null;
          client_id?: string;
          created_at?: string | null;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          name?: string;
          organization_id?: string;
          start_date?: string | null;
          status?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'projects_client_id_fkey';
            columns: ['client_id'];
            isOneToOne: false;
            referencedRelation: 'clients';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'projects_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
      tasks: {
        Row: {
          assigned_to: string | null;
          created_at: string | null;
          description: string | null;
          due_date: string | null;
          estimated_hours: number | null;
          id: string;
          name: string;
          organization_id: string;
          parent_task_id: string | null;
          priority: string | null;
          project_id: string;
          status: string;
          updated_at: string | null;
        };
        Insert: {
          assigned_to?: string | null;
          created_at?: string | null;
          description?: string | null;
          due_date?: string | null;
          estimated_hours?: number | null;
          id?: string;
          name: string;
          organization_id: string;
          parent_task_id?: string | null;
          priority?: string | null;
          project_id: string;
          status?: string;
          updated_at?: string | null;
        };
        Update: {
          assigned_to?: string | null;
          created_at?: string | null;
          description?: string | null;
          due_date?: string | null;
          estimated_hours?: number | null;
          id?: string;
          name?: string;
          organization_id?: string;
          parent_task_id?: string | null;
          priority?: string | null;
          project_id?: string;
          status?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'tasks_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tasks_parent_task_id_fkey';
            columns: ['parent_task_id'];
            isOneToOne: false;
            referencedRelation: 'tasks';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tasks_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
        ];
      };
      time_entries: {
        Row: {
          billable: boolean;
          billed: boolean;
          client_id: string;
          created_at: string | null;
          description: string;
          end_time: string | null;
          hourly_rate: number;
          id: string;
          invoice_id: string | null;
          organization_id: string;
          start_time: string;
          task_id: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          billable?: boolean;
          billed?: boolean;
          client_id: string;
          created_at?: string | null;
          description: string;
          end_time?: string | null;
          hourly_rate: number;
          id?: string;
          invoice_id?: string | null;
          organization_id: string;
          start_time: string;
          task_id?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          billable?: boolean;
          billed?: boolean;
          client_id?: string;
          created_at?: string | null;
          description?: string;
          end_time?: string | null;
          hourly_rate?: number;
          id?: string;
          invoice_id?: string | null;
          organization_id?: string;
          start_time?: string;
          task_id?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'time_entries_client_id_fkey';
            columns: ['client_id'];
            isOneToOne: false;
            referencedRelation: 'clients';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'time_entries_invoice_id_fkey';
            columns: ['invoice_id'];
            isOneToOne: false;
            referencedRelation: 'invoices';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'time_entries_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'time_entries_task_id_fkey';
            columns: ['task_id'];
            isOneToOne: false;
            referencedRelation: 'tasks';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'time_entries_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      check_overdue_invoices: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      get_organization_stats: {
        Args: { organization_id_param: string };
        Returns: {
          total_clients: number;
          total_invoices: number;
          total_projects: number;
          total_products: number;
          total_payments: number;
        }[];
      };
      get_user_stats: {
        Args: { user_id_param: string };
        Returns: {
          total_invoiced: number;
          total_paid: number;
          total_outstanding: number;
          total_overdue: number;
          client_count: number;
          invoice_count: number;
          time_tracked_hours: number;
          project_count: number;
          completed_tasks_count: number;
        }[];
      };
      sum_payments_by_invoice: {
        Args: { invoiceid: string };
        Returns: number;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums'] | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
