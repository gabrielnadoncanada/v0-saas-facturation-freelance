import { Chat } from "@/features/chatbot/chat/Chat";

export default function ChatbotPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Assistant IA</h1>
        <p className="text-muted-foreground">
          Posez des questions sur vos factures, clients et projets à votre assistant IA.
        </p>
      </div>
      <div className="max-w-4xl mx-auto">
        <Chat />
      </div>
    </div>
  );
} 