import { date, numeric, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { organizations } from './organizations';
import { clients } from './clients';

export const invoices = pgTable('invoices', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  clientId: uuid('client_id')
    .notNull()
    .references(() => clients.id, { onDelete: 'restrict' }),
  invoiceNumber: text('invoice_number').notNull(),
  issueDate: date('issue_date').notNull().defaultNow(),
  dueDate: date('due_date').notNull(),
  currency: text('currency').notNull().default('EUR'),
  language: text('language').notNull().default('fr'),
  notes: text('notes'),
  status: text('status').notNull().default('sent'),
  subtotal: numeric('subtotal', { precision: 12, scale: 2 }).notNull().default('0'),
  taxRate: numeric('tax_rate', { precision: 5, scale: 2 }),
  taxTotal: numeric('tax_total', { precision: 12, scale: 2 }).notNull().default('0'),
  total: numeric('total', { precision: 12, scale: 2 }).notNull().default('0'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

