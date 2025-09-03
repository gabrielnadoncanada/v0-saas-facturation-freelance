import { integer, numeric, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { organizations } from './organizations';
import { invoices } from './invoices';
import { timeEntries } from './timeEntries';

export const invoiceItems = pgTable('invoice_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  invoiceId: uuid('invoice_id')
    .notNull()
    .references(() => invoices.id, { onDelete: 'cascade' }),
  description: text('description').notNull(),
  quantity: integer('quantity').notNull().default(1),
  unitPrice: numeric('unit_price', { precision: 12, scale: 2 }).notNull().default('0'),
  taxRate: numeric('tax_rate', { precision: 5, scale: 2 }).notNull().default('0'),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull().default('0'),
  timeEntryId: uuid('time_entry_id').references(() => timeEntries.id, { onDelete: 'set null' }),
  position: integer('position'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

