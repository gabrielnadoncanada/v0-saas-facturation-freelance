import { invoiceTools } from "./invoice.tools";
import { clientTools } from "./client.tools";
import { projectTools } from "./project.tools";

// Combine all tools into a single object
export const chatbotTools = {
  ...invoiceTools,
  ...clientTools,
  ...projectTools,
};

// Export individual tool groups for potential future use
export { invoiceTools, clientTools, projectTools }; 