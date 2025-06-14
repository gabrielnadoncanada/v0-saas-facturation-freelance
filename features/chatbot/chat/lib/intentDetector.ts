import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export interface DetectedIntent {
  intent: string;
  confidence: number;
  entities: Record<string, any>;
  workflow: string[];
}

export async function detectIntent(userMessage: string): Promise<DetectedIntent> {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are an intent detection system for a freelance business assistant.

AVAILABLE INTENTS:
- CREATE_INVOICE_AND_SEND: Create invoice and send by email
- CREATE_INVOICE: Create invoice only
- SEND_INVOICE: Send existing invoice by email
- LIST_INVOICES: List all invoices
- GET_INVOICE_DETAILS: Get specific invoice details
- CREATE_CLIENT: Create new client
- LIST_CLIENTS: List all clients
- FIND_CLIENT: Find client by name
- LIST_PROJECTS: List all projects

ENTITY EXTRACTION:
Extract these entities from the user message:
- client_name: Name of the client
- client_email: Email address
- total_amount: Total amount (convert to number)
- currency: Currency (USD, EUR, CAD, etc.)
- invoice_id: Invoice ID or number
- description: Service description
- send_email: Boolean if email should be sent

WORKFLOW MAPPING:
- CREATE_INVOICE_AND_SEND: ["findClientByName", "createClient?", "createSimpleInvoice", "sendInvoiceEmail"]
- CREATE_INVOICE: ["findClientByName", "createClient?", "createSimpleInvoice"]
- SEND_INVOICE: ["getInvoiceDetails", "sendInvoiceEmail"]
- LIST_INVOICES: ["listInvoices"]
- GET_INVOICE_DETAILS: ["getInvoiceDetails"]
- CREATE_CLIENT: ["createClient"]
- LIST_CLIENTS: ["listClients"]
- FIND_CLIENT: ["findClientByName"]
- LIST_PROJECTS: ["listProjects"]

Respond ONLY with a JSON object in this exact format:
{
  "intent": "INTENT_NAME",
  "confidence": 0.95,
  "entities": {
    "client_name": "extracted_name",
    "client_email": "extracted_email",
    "total_amount": 500,
    "currency": "USD",
    "send_email": true
  },
  "workflow": ["tool1", "tool2", "tool3"]
}`
      },
      {
        role: "user",
        content: userMessage
      }
    ],
    temperature: 0.1,
    max_tokens: 500,
  });

  const response = completion.choices[0]?.message?.content;
  if (!response) {
    throw new Error("No response from intent detector");
  }

  try {
    return JSON.parse(response);
  } catch (error) {
    throw new Error(`Failed to parse intent response: ${response}`);
  }
} 