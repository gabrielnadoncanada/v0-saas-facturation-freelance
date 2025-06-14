# Chatbot Feature

This feature implements an intent-based chatbot assistant for managing invoices, clients, and projects using a reliable workflow execution system.

## Architecture

The chatbot uses a **3-step intent-based approach** instead of unreliable LLM tool calling:

1. **Intent Detection** - Analyze user request and extract entities
2. **Workflow Execution** - Chain tools based on detected intent
3. **Response Formatting** - Generate human-readable response

## Structure

```
features/chatbot/
├── chat/
│   ├── hooks/
│   │   └── useChat.ts              # React hook for chat functionality
│   ├── tools/
│   │   ├── invoice.tools.ts        # Invoice-related tools
│   │   ├── client.tools.ts         # Client-related tools
│   │   ├── project.tools.ts        # Project-related tools
│   │   └── index.ts                # Tool exports and combinations
│   ├── lib/
│   │   ├── intentDetector.ts       # Intent detection and entity extraction
│   │   ├── workflowExecutor.ts     # Tool chaining and execution
│   │   ├── responseFormatter.ts    # Human-readable response generation
│   │   ├── toolsConverter.ts       # Legacy tool converter (unused)
│   │   └── index.ts                # Library exports
│   └── ui/                         # UI components (to be added)
└── README.md                       # This file
```

## Tools Organization

### Invoice Tools (`invoice.tools.ts`)
- `listInvoices` - List all invoices with status and basic information
- `getInvoiceDetails` - Get detailed information about a specific invoice
- `createInvoice` - Create a new invoice with items

### Client Tools (`client.tools.ts`)
- `listClients` - List all clients with basic information
- `createClient` - Create a new client with provided information

### Project Tools (`project.tools.ts`)
- `listProjects` - List all projects with status and basic information

## How It Works

### 1. Intent Detection (`intentDetector.ts`)
```typescript
const intent = await detectIntent("Créer une facture pour Yolibeth pour 500$");
// Returns:
{
  intent: "CREATE_INVOICE_AND_SEND",
  confidence: 0.95,
  entities: {
    client_name: "Yolibeth",
    total_amount: 500,
    currency: "USD",
    send_email: true
  },
  workflow: ["findClientByName", "createClient?", "createSimpleInvoice", "sendInvoiceEmail"]
}
```

### 2. Workflow Execution (`workflowExecutor.ts`)
```typescript
const executor = new WorkflowExecutor();
const result = await executor.executeWorkflow(intent);
// Executes tools in sequence:
// 1. findClientByName(name: "Yolibeth")
// 2. createClient? (only if client not found)
// 3. createSimpleInvoice(client_id, total_amount: 500, currency: "USD")
// 4. sendInvoiceEmail(invoiceId, recipientEmail)
```

### 3. Response Formatting (`responseFormatter.ts`)
```typescript
const response = await formatResponse(userMessage, intent, workflowResult);
// Returns natural language response in user's language
```

## Supported Intents

- **CREATE_INVOICE_AND_SEND**: Create invoice and send by email
- **CREATE_INVOICE**: Create invoice only
- **SEND_INVOICE**: Send existing invoice by email
- **LIST_INVOICES**: List all invoices
- **GET_INVOICE_DETAILS**: Get specific invoice details
- **CREATE_CLIENT**: Create new client
- **LIST_CLIENTS**: List all clients
- **FIND_CLIENT**: Find client by name
- **LIST_PROJECTS**: List all projects

## Adding New Intents

1. **Add intent to `intentDetector.ts`**:
   ```typescript
   - UPDATE_INVOICE: Update existing invoice
   ```

2. **Add workflow mapping**:
   ```typescript
   - UPDATE_INVOICE: ["getInvoiceDetails", "updateInvoice"]
   ```

3. **Add parameter building in `workflowExecutor.ts`**:
   ```typescript
   case 'updateInvoice':
     return {
       invoice_id: entities.invoice_id,
       updates: entities.updates
     };
   ```

4. **Create the tool in appropriate tools file**

## Architecture Benefits

- **Reliability**: No more unreliable LLM tool calling
- **Predictability**: Clear workflow execution with proper error handling
- **Debuggability**: Full visibility into each step of execution
- **Maintainability**: Easy to add new intents and workflows
- **Type Safety**: Full TypeScript support throughout
- **Language Support**: Automatic French/English detection and response
- **Feature-Sliced Design**: Follows the project's FSD architecture

## Features

- **Invoice Management**: Ask questions about invoices, their status, and details
- **Client Information**: Get information about clients and their invoices
- **Project Tracking**: Query project status and details
- **Natural Language Interface**: Interact using natural language queries

## Setup

### 1. Install Dependencies

The required dependencies are already installed:
- `ai` - Vercel AI SDK
- `@ai-sdk/groq` - Groq provider for AI SDK

### 2. Environment Variables

Add your Groq API key to your `.env.local` file:

```env
GROQ_API_KEY=your_groq_api_key_here
```

You can get a free API key from [Groq Console](https://console.groq.com/).

### 3. Usage

The chatbot is available at `/dashboard/chatbot` and provides the following capabilities:

#### Available Tools

1. **listInvoices**: List all invoices from the organization
   - Parameters: None (uses existing invoice feature functions)

2. **getInvoiceDetails**: Get detailed information about a specific invoice
   - Parameters: `invoiceId` (required)

3. **listClients**: List all clients from the organization
   - Parameters: None (uses existing client feature functions)

4. **listProjects**: List all projects from the organization
   - Parameters: None (uses existing project feature functions)

#### Example Queries

- "Show me all unpaid invoices"
- "What's the status of invoice INV-001?"
- "List my active projects"
- "Who are my top clients?"
- "Show me overdue invoices"

## Architecture

The chatbot feature follows the Feature-Sliced Design architecture:

```
features/chatbot/
├── chat/
│   ├── actions/
│   │   └── chat.action.ts      # Main AI chat handler (uses existing feature functions)
│   ├── ui/
│   │   └── ChatInterface.tsx   # Chat UI component
│   ├── hooks/
│   │   └── useChat.ts          # Chat logic hook
│   ├── __tests__/              # Unit tests
│   └── Chat.tsx                # Main orchestrator component
├── demo/
│   └── DemoPage.tsx            # Demo page showcasing the feature
├── shared/
│   └── types/
│       └── index.ts            # Shared types
└── README.md                   # This file
```

**Note**: The chatbot reuses existing functions from other features:
- Invoices: `@/features/invoice/list/model/getInvoices` and `@/features/invoice/view/model/getInvoice`
- Clients: `@/features/client/list/model/getClients`
- Projects: `@/features/project/list/model/getProjects`

## API Route

The chatbot API is available at `/api/chat` and handles POST requests with the following format:

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Show me all invoices"
    }
  ]
}
```

## Testing

Run the tests with:

```bash
pnpm test features/chatbot
```

The feature includes comprehensive tests for:
- Chat hook functionality
- Database model functions
- Error handling

## Customization

### Adding New Tools

To add new tools to the chatbot:

1. Use existing model functions from other features (recommended) or create new ones if needed
2. Add the tool definition to `features/chatbot/chat/actions/chat.action.ts`
3. Update the system prompt if needed

**Best Practice**: Always check if the functionality already exists in other features before creating new functions. This follows the DRY principle and Feature-Sliced Design architecture.

### Modifying the UI

The chat interface can be customized by editing:
- `features/chatbot/chat/ui/ChatInterface.tsx` - Main chat UI
- `features/chatbot/chat/Chat.tsx` - Orchestrator component

### Changing the AI Model

To use a different Groq model, update the model name in `chat.action.ts`:

```typescript
model: groq("llama-3.3-70b-versatile"), // Change this line
```

Available Groq models:
- `llama-3.3-70b-versatile`
- `