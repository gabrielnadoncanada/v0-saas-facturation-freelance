import Groq from "groq-sdk";
import { WorkflowResult } from "./workflowExecutor";
import { DetectedIntent } from "./intentDetector";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function formatResponse(
  userMessage: string,
  intent: DetectedIntent,
  workflowResult: WorkflowResult
): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are a helpful freelance business assistant. 

Your job is to create a natural, conversational response based on the workflow execution results.

GUIDELINES:
- Respond in the same language as the user's original message
- Be concise but informative
- If the workflow was successful, summarize what was accomplished
- If there were errors, explain what went wrong and suggest solutions
- Include relevant details like invoice numbers, amounts, client names, etc.
- Be professional but friendly

WORKFLOW CONTEXT:
- User Intent: ${intent.intent}
- Confidence: ${intent.confidence}
- Workflow Success: ${workflowResult.success}

EXECUTION STEPS:
${workflowResult.steps.map(step => 
  `- ${step.tool}: ${step.error ? `ERROR: ${step.error}` : 'SUCCESS'}`
).join('\n')}

FINAL RESULT:
${JSON.stringify(workflowResult.finalResult, null, 2)}

Create a natural response that explains what happened to the user.`
      },
      {
        role: "user",
        content: `Original request: "${userMessage}"`
      }
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  return completion.choices[0]?.message?.content || "I apologize, but I couldn't process your request properly.";
} 