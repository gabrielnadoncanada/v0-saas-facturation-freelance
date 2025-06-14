import { z } from "zod";

type ChatbotTool = {
  description: string;
  parameters: z.ZodObject<any>;
  execute: (args: any) => Promise<any>;
};

type GroqTool = {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: {
      type: "object";
      properties: Record<string, any>;
      required?: string[];
    };
  };
};

/**
 * Converts chatbot tools to Groq-compatible format
 */
export function convertToolsToGroqFormat(tools: Record<string, ChatbotTool>): GroqTool[] {
  return Object.entries(tools).map(([name, tool]) => ({
    type: "function" as const,
    function: {
      name,
      description: tool.description,
      parameters: tool.parameters.shape ? {
        type: "object",
        properties: Object.keys(tool.parameters.shape).reduce((acc, key) => {
          acc[key] = { type: "string" };
          return acc;
        }, {} as Record<string, any>),
        required: Object.keys(tool.parameters.shape || {}),
      } : {
        type: "object",
        properties: {},
      },
    },
  }));
} 