import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type {
  organizations,
  profiles,
  organizationMembers,
  organizationInvitations,
  organizationSettings,
  clients,
  projects,
  tasks,
  productCategories,
  products,
  invoices,
  timeEntries,
  invoiceItems,
  payments,
  notifications,
} from './schema';

// Select types (for reading from database)
export type Organization = InferSelectModel<typeof organizations>;
export type Profile = InferSelectModel<typeof profiles>;
export type OrganizationSettings = InferSelectModel<typeof organizationSettings>;
export type OrganizationMember = InferSelectModel<typeof organizationMembers>;
export type OrganizationInvitation = InferSelectModel<typeof organizationInvitations>;
export type Client = InferSelectModel<typeof clients>;
export type Project = InferSelectModel<typeof projects>;
export type Task = InferSelectModel<typeof tasks>;
export type ProductCategory = InferSelectModel<typeof productCategories>;
export type Product = InferSelectModel<typeof products>;
export type Invoice = InferSelectModel<typeof invoices>;
export type TimeEntry = InferSelectModel<typeof timeEntries>;
export type InvoiceItem = InferSelectModel<typeof invoiceItems>;
export type Payment = InferSelectModel<typeof payments>;
export type Notification = InferSelectModel<typeof notifications>;

// Insert types (for creating new records)
export type NewOrganization = InferInsertModel<typeof organizations>;
export type NewProfile = InferInsertModel<typeof profiles>;
export type NewOrganizationMember = InferInsertModel<typeof organizationMembers>;
export type NewOrganizationInvitation = InferInsertModel<typeof organizationInvitations>;
export type NewClient = InferInsertModel<typeof clients>;
export type NewProject = InferInsertModel<typeof projects>;
export type NewTask = InferInsertModel<typeof tasks>;
export type NewProductCategory = InferInsertModel<typeof productCategories>;
export type NewProduct = InferInsertModel<typeof products>;
export type NewInvoice = InferInsertModel<typeof invoices>;
export type NewTimeEntry = InferInsertModel<typeof timeEntries>;
export type NewInvoiceItem = InferInsertModel<typeof invoiceItems>;
export type NewPayment = InferInsertModel<typeof payments>;
export type NewNotification = InferInsertModel<typeof notifications>;

// Utility types for common queries
export type ClientWithProjects = Client & {
  projects: Project[];
};

export type InvoiceWithItems = Invoice & {
  items: InvoiceItem[];
  client: Client;
  payments: Payment[];
};

export type ProjectWithTasks = Project & {
  tasks: Task[];
  client: Client;
};

export type OrganizationWithMembers = Organization & {
  members: OrganizationMember[];
};
