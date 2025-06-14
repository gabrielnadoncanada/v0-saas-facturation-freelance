import Groq from "groq-sdk";
import { detectIntent } from "@/features/chatbot/chat/lib/intentDetector";
import { WorkflowExecutor } from "@/features/chatbot/chat/lib/workflowExecutor";
import { formatResponse } from "@/features/chatbot/chat/lib/responseFormatter";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    
    // Get the latest user message
    const userMessage = messages[messages.length - 1]?.content;
    if (!userMessage) {
      throw new Error("No user message provided");
    }

    console.log("🔍 Detecting intent for:", userMessage);
    
    // Step 1: Detect intent and extract entities
    const intent = await detectIntent(userMessage);
    console.log("🎯 Detected intent:", intent);

    // Step 2: Execute workflow based on intent
    const executor = new WorkflowExecutor();
    const workflowResult = await executor.executeWorkflow(intent);
    console.log("⚙️ Workflow result:", workflowResult);

    // Step 3: Format response for user
    const response = await formatResponse(userMessage, intent, workflowResult);
    console.log("💬 Formatted response:", response);

    return new Response(
      JSON.stringify({
        role: "assistant",
        content: response,
        debug: {
          intent,
          workflowResult,
        }
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Chat API error:", error);
    
    // Try to provide a helpful error response
    let errorMessage = "I apologize, but I encountered an error processing your request.";
    
    if (error instanceof Error) {
      if (error.message.includes("intent")) {
        errorMessage = "I had trouble understanding your request. Could you please rephrase it?";
      } else if (error.message.includes("workflow")) {
        errorMessage = "I understood your request but encountered an issue executing it. Please try again.";
      }
    }

    return new Response(
      JSON.stringify({
        role: "assistant",
        content: errorMessage,
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
