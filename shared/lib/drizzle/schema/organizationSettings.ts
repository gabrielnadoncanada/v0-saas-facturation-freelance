import { pgTable, text, timestamp, uuid, numeric, integer } from 'drizzle-orm/pg-core';
import { organizations } from './organizations';

export const organizationSettings = pgTable('organization_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' })
    .unique(),
  defaultCurrency: text('default_currency').notNull().default('EUR'),
  defaultTaxRate: numeric('default_tax_rate', { precision: 5, scale: 2 }).notNull().default('20'),
  invoicePrefix: text('invoice_prefix').notNull().default('INV'),
  invoiceNumberFormat: text('invoice_number_format').notNull().default('{prefix}-{year}-{number:4}'),
  nextInvoiceNumber: integer('next_invoice_number').notNull().default(1),
  defaultPaymentTerms: integer('default_payment_terms').notNull().default(30),
  lateFeePercentage: numeric('late_fee_percentage', { precision: 5, scale: 2 }).notNull().default('0'),
  companyAddress: text('company_address'),
  companyCity: text('company_city'),
  companyPostalCode: text('company_postal_code'),
  companyCountry: text('company_country'),
  companyPhone: text('company_phone'),
  companyEmail: text('company_email'),
  companyWebsite: text('company_website'),
  companyTaxNumber: text('company_tax_number'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
