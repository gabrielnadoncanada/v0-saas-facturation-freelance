import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './shared/lib/drizzle/schema/index.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
  out: './drizzle/migrations',
});
