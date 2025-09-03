import { pgTable, text, timestamp, uuid, numeric } from 'drizzle-orm/pg-core';
import { organizations } from './organizations';

export const clients = pgTable('clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  hourlyRate: numeric('hourly_rate', { precision: 10, scale: 2 }),
  billingAddress: text('billing_address'),
  billingCity: text('billing_city'),
  billingPostalCode: text('billing_postal_code'),
  billingCountry: text('billing_country'),
  shippingAddress: text('shipping_address'),
  shippingCity: text('shipping_city'),
  shippingPostalCode: text('shipping_postal_code'),
  shippingCountry: text('shipping_country'),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

