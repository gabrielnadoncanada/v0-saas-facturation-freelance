import { chatbotTools } from "../tools";
import { DetectedIntent } from "./intentDetector";

export interface WorkflowStep {
  tool: string;
  parameters: Record<string, any>;
  result?: any;
  error?: string;
}

export interface WorkflowResult {
  success: boolean;
  steps: WorkflowStep[];
  finalResult: any;
  error?: string;
}

export class WorkflowExecutor {
  private tools = chatbotTools;
  private context: Record<string, any> = {};

  async executeWorkflow(intent: DetectedIntent): Promise<WorkflowResult> {
    const steps: WorkflowStep[] = [];
    let finalResult: any = null;

    try {
      for (const toolName of intent.workflow) {
        // Skip optional tools (marked with ?)
        if (toolName.endsWith('?')) {
          const actualToolName = toolName.slice(0, -1);
          const shouldExecute = await this.shouldExecuteOptionalTool(actualToolName, intent, steps);
          if (!shouldExecute) {
            continue;
          }
          const step = await this.executeStep(actualToolName, intent, steps);
          steps.push(step);
        } else {
          const step = await this.executeStep(toolName, intent, steps);
          steps.push(step);
        }
      }

      // Get the final result from the last successful step
      const lastSuccessfulStep = steps.filter(s => !s.error).pop();
      finalResult = lastSuccessfulStep?.result || null;

      return {
        success: true,
        steps,
        finalResult,
      };
    } catch (error) {
      return {
        success: false,
        steps,
        finalResult: null,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  private async executeStep(toolName: string, intent: DetectedIntent, previousSteps: WorkflowStep[]): Promise<WorkflowStep> {
    const tool = this.tools[toolName as keyof typeof this.tools];
    
    if (!tool) {
      return {
        tool: toolName,
        parameters: {},
        error: `Tool ${toolName} not found`,
      };
    }

    try {
      const parameters = this.buildParameters(toolName, intent, previousSteps);
      const result = await (tool.execute as any)(parameters);
      
      // Store result in context for next steps
      this.context[toolName] = result;
      
      return {
        tool: toolName,
        parameters,
        result,
      };
    } catch (error) {
      return {
        tool: toolName,
        parameters: {},
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  private buildParameters(toolName: string, intent: DetectedIntent, previousSteps: WorkflowStep[]): Record<string, any> {
    const entities = intent.entities;
    
    switch (toolName) {
      case 'findClientByName':
        return {
          name: entities.client_name,
        };

      case 'createClient':
        return {
          name: entities.client_name,
          email: entities.client_email,
        };

      case 'createSimpleInvoice':
        // Get client_id from previous findClientByName step
        const findClientStep = previousSteps.find(s => s.tool === 'findClientByName');
        const createClientStep = previousSteps.find(s => s.tool === 'createClient');
        
        let clientId = null;
        if (findClientStep?.result?.success) {
          clientId = findClientStep.result.client.id;
        } else if (createClientStep?.result?.client?.id) {
          clientId = createClientStep.result.client.id;
        }

        return {
          client_id: clientId,
          total_amount: entities.total_amount,
          description: entities.description || "Service provided",
          currency: entities.currency || "USD",
          tax_rate: entities.tax_rate || 0,
        };

      case 'sendInvoiceEmail':
        // Get invoice_id from previous createSimpleInvoice step or use provided invoice_id
        const createInvoiceStep = previousSteps.find(s => s.tool === 'createSimpleInvoice');
        const invoiceId = createInvoiceStep?.result?.invoice_id || entities.invoice_id;

        return {
          invoiceId: invoiceId,
          recipientEmail: entities.client_email,
        };

      case 'getInvoiceDetails':
        return {
          invoiceId: entities.invoice_id,
        };

      case 'listInvoices':
      case 'listClients':
      case 'listProjects':
        return {};

      default:
        return entities;
    }
  }

  private async shouldExecuteOptionalTool(toolName: string, intent: DetectedIntent, previousSteps: WorkflowStep[]): Promise<boolean> {
    switch (toolName) {
      case 'createClient':
        // Only create client if findClientByName failed
        const findClientStep = previousSteps.find(s => s.tool === 'findClientByName');
        return findClientStep?.result?.success === false;
      
      default:
        return true;
    }
  }
} 