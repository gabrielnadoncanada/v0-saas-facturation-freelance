import { pgTable, text, timestamp, uuid, numeric } from 'drizzle-orm/pg-core';
import { organizations } from './organizations';

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull(),
  fullName: text('full_name'),
  companyName: text('company_name'),
  logoUrl: text('logo_url'),
  defaultCurrency: text('default_currency'),
  defaultHourlyRate: numeric('default_hourly_rate', { precision: 10, scale: 2 }),
  organizationId: uuid('organization_id').references(() => organizations.id, {
    onDelete: 'set null',
  }),
  address: text('address'),
  city: text('city'),
  postalCode: text('postal_code'),
  country: text('country'),
  phone: text('phone'),
  taxNumber: text('tax_number'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

