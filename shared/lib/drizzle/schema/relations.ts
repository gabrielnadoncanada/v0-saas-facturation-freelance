import { relations } from 'drizzle-orm';
import { organizations } from './organizations';
import { profiles } from './profiles';
import { organizationMembers } from './organizationMembers';
import { organizationInvitations } from './organizationInvitations';
import { clients } from './clients';
import { projects } from './projects';
import { tasks } from './tasks';
import { productCategories } from './productCategories';
import { products } from './products';
import { invoices } from './invoices';
import { timeEntries } from './timeEntries';
import { invoiceItems } from './invoiceItems';
import { payments } from './payments';
import { notifications } from './notifications';

export const organizationsRelations = relations(organizations, ({ many }) => ({
  members: many(organizationMembers),
  invitations: many(organizationInvitations),
  clients: many(clients),
  projects: many(projects),
  productCategories: many(productCategories),
  products: many(products),
  invoices: many(invoices),
  timeEntries: many(timeEntries),
  invoiceItems: many(invoiceItems),
  payments: many(payments),
  notifications: many(notifications),
  tasks: many(tasks),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  organization: one(organizations, {
    fields: [profiles.organizationId],
    references: [organizations.id],
  }),
}));

export const organizationMembersRelations = relations(organizationMembers, ({ one }) => ({
  organization: one(organizations, {
    fields: [organizationMembers.organizationId],
    references: [organizations.id],
  }),
}));

export const organizationInvitationsRelations = relations(organizationInvitations, ({ one }) => ({
  organization: one(organizations, {
    fields: [organizationInvitations.organizationId],
    references: [organizations.id],
  }),
}));

export const clientsRelations = relations(clients, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [clients.organizationId],
    references: [organizations.id],
  }),
  projects: many(projects),
  invoices: many(invoices),
  timeEntries: many(timeEntries),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [projects.organizationId],
    references: [organizations.id],
  }),
  client: one(clients, {
    fields: [projects.clientId],
    references: [clients.id],
  }),
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [tasks.organizationId],
    references: [organizations.id],
  }),
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  parentTask: one(tasks, {
    fields: [tasks.parentTaskId],
    references: [tasks.id],
  }),
  subtasks: many(tasks),
  timeEntries: many(timeEntries),
}));

export const productCategoriesRelations = relations(productCategories, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [productCategories.organizationId],
    references: [organizations.id],
  }),
  products: many(products),
}));

export const productsRelations = relations(products, ({ one }) => ({
  organization: one(organizations, {
    fields: [products.organizationId],
    references: [organizations.id],
  }),
  category: one(productCategories, {
    fields: [products.categoryId],
    references: [productCategories.id],
  }),
}));

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [invoices.organizationId],
    references: [organizations.id],
  }),
  client: one(clients, {
    fields: [invoices.clientId],
    references: [clients.id],
  }),
  items: many(invoiceItems),
  payments: many(payments),
  timeEntries: many(timeEntries),
}));

export const timeEntriesRelations = relations(timeEntries, ({ one }) => ({
  organization: one(organizations, {
    fields: [timeEntries.organizationId],
    references: [organizations.id],
  }),
  client: one(clients, {
    fields: [timeEntries.clientId],
    references: [clients.id],
  }),
  task: one(tasks, {
    fields: [timeEntries.taskId],
    references: [tasks.id],
  }),
  invoice: one(invoices, {
    fields: [timeEntries.invoiceId],
    references: [invoices.id],
  }),
}));

export const invoiceItemsRelations = relations(invoiceItems, ({ one }) => ({
  organization: one(organizations, {
    fields: [invoiceItems.organizationId],
    references: [organizations.id],
  }),
  invoice: one(invoices, {
    fields: [invoiceItems.invoiceId],
    references: [invoices.id],
  }),
  timeEntry: one(timeEntries, {
    fields: [invoiceItems.timeEntryId],
    references: [timeEntries.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  organization: one(organizations, {
    fields: [payments.organizationId],
    references: [organizations.id],
  }),
  invoice: one(invoices, {
    fields: [payments.invoiceId],
    references: [invoices.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  organization: one(organizations, {
    fields: [notifications.organizationId],
    references: [organizations.id],
  }),
}));

