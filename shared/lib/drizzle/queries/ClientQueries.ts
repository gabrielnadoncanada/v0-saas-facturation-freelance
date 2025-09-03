import { db } from '../db';
import { clients } from '../schema';
import { eq, and, sql } from 'drizzle-orm';
import type { Client, NewClient, ClientWithProjects } from '../types';
import { getSessionUserDrizzle } from '@/shared/utils/getSessionUserDrizzle';

export class ClientQueries {
  // Create a new client
  static async create(data: Omit<NewClient, 'organizationId'>): Promise<Client> {
    const { organization } = await getSessionUserDrizzle();

    if (!organization) {
      throw new Error('Aucune organisation active');
    }

    const clientData = {
      ...data,
      organizationId: organization.id,
    };

    const result = await db.insert(clients).values(clientData).returning();
    return result[0];
  }

  // Get client by ID
  static async getById(clientId: string): Promise<Client> {
    const { organization } = await getSessionUserDrizzle();

    if (!organization) {
      throw new Error('Aucune organisation active');
    }

    const result = await db
      .select()
      .from(clients)
      .where(and(eq(clients.id, clientId), eq(clients.organizationId, organization.id)))
      .limit(1);

    if (!result[0]) {
      throw new Error('Client non trouvé');
    }

    return result[0];
  }

  // Get all clients for the current organization
  static async getAll(): Promise<Client[]> {
    const { organization } = await getSessionUserDrizzle();

    if (!organization) {
      return [];
    }

    return await db
      .select()
      .from(clients)
      .where(eq(clients.organizationId, organization.id))
      .orderBy(clients.name);
  }

  // Get all clients with projects for the current organization
  static async getAllWithProjects() {
    const { organization } = await getSessionUserDrizzle();

    if (!organization) {
      return [];
    }

    return await db.query.clients.findMany({
      where: eq(clients.organizationId, organization.id),
      with: {
        projects: true,
      },
      orderBy: (clients, { asc }) => [asc(clients.name)],
    });
  }

  // Update client
  static async update(clientId: string, data: Partial<NewClient>): Promise<Client> {
    const { organization } = await getSessionUserDrizzle();

    if (!organization) {
      throw new Error('Aucune organisation active');
    }

    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    const result = await db
      .update(clients)
      .set(updateData)
      .where(and(eq(clients.id, clientId), eq(clients.organizationId, organization.id)))
      .returning();

    if (!result[0]) {
      throw new Error('Client non trouvé');
    }

    return result[0];
  }

  // Delete client
  static async delete(clientId: string): Promise<Client> {
    const { organization } = await getSessionUserDrizzle();

    if (!organization) {
      throw new Error('Aucune organisation active');
    }

    const result = await db
      .delete(clients)
      .where(and(eq(clients.id, clientId), eq(clients.organizationId, organization.id)))
      .returning();

    if (!result[0]) {
      throw new Error('Client non trouvé');
    }

    return result[0];
  }

  // Get client statistics using PostgreSQL RPC function
  static async getStats(clientId: string) {
    const { organization } = await getSessionUserDrizzle();
    if (!organization) throw new Error('Aucune organisation active');

    const defaults = {
      totalInvoiced: 0,
      totalPaid: 0,
      totalUnpaid: 0,
      invoiceCount: 0,
      paidInvoiceCount: 0,
      unpaidInvoiceCount: 0,
      paidPercentage: 0,
      averageInvoiceAmount: 0,
    };

    // ✅ Interpolation Drizzle = paramètres bindés (pas de concat), + cast ::uuid → pas d'injection
    const result = await db.execute<{ stats: any }>(
      sql`select get_client_stats(${clientId}::uuid, ${organization.id}::uuid) as stats`,
    );

    const value = result?.[0]?.stats;
    return value && typeof value === 'object' ? value : defaults;
  }
}
