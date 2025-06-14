import { z } from "zod";
import { getClients } from "@/features/client/list/model/getClients";
import { createClient } from "@/features/client/create/model/createClient";

export const clientTools = {
  listClients: {
    description: "List all clients with their basic information",
    parameters: z.object({}),
    execute: async function () {
      const clients = await getClients();
      return clients;
    },
  },
  createClient: {
    description: "Create a new client with the provided information",
    parameters: z.object({
      name: z.string().min(1, "Client name is required"),
      email: z.string().email("Valid email is required").optional(),
      phone: z.string().optional(),
      billing_address: z.string().optional(),
      billing_city: z.string().optional(),
      billing_postal_code: z.string().optional(),
      billing_country: z.string().optional(),
      shipping_address: z.string().optional(),
      shipping_city: z.string().optional(),
      shipping_postal_code: z.string().optional(),
      shipping_country: z.string().optional(),
      notes: z.string().optional(),
      sameAsShipping: z.boolean().optional(),
    }),
    execute: async function ({ name, email, phone, billing_address, billing_city, billing_postal_code, billing_country, shipping_address, shipping_city, shipping_postal_code, shipping_country, notes, sameAsShipping }: {
      name: string;
      email?: string;
      phone?: string;
      billing_address?: string;
      billing_city?: string;
      billing_postal_code?: string;
      billing_country?: string;
      shipping_address?: string;
      shipping_city?: string;
      shipping_postal_code?: string;
      shipping_country?: string;
      notes?: string;
      sameAsShipping?: boolean;
    }) {
      const clientData = {
        name,
        email: email || "",
        phone: phone || "",
        billing_address: billing_address || "",
        billing_city: billing_city || "",
        billing_postal_code: billing_postal_code || "",
        billing_country: billing_country || "",
        shipping_address: shipping_address || "",
        shipping_city: shipping_city || "",
        shipping_postal_code: shipping_postal_code || "",
        shipping_country: shipping_country || "",
        notes: notes || "",
        sameAsShipping: sameAsShipping || false,
      };
      
      const client = await createClient(clientData);
      return {
        success: true,
        client,
        message: `Client "${name}" has been successfully created with ID: ${client.id}`,
      };
    },
  },
  findClientByName: {
    description: "Find a client by name (case-insensitive search)",
    parameters: z.object({
      name: z.string().min(1, "Client name is required"),
    }),
    execute: async function ({ name }: { name: string }) {
      const clients = await getClients();
      const foundClient = clients.find(client => 
        client.name.toLowerCase().includes(name.toLowerCase())
      );
      
      if (!foundClient) {
        return {
          success: false,
          message: `No client found with name containing "${name}". Available clients: ${clients.map(c => c.name).join(', ')}`,
          available_clients: clients.map(c => ({ id: c.id, name: c.name, email: c.email })),
        };
      }
      
      return {
        success: true,
        client: foundClient,
        message: `Found client: ${foundClient.name} (ID: ${foundClient.id})`,
      };
    },
  },
}; 