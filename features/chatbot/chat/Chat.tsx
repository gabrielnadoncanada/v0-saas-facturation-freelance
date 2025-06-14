"use client";

import { ChatInterface } from "./ui/ChatInterface";
import { useChat } from "./hooks/useChat";

export function Chat() {
  const {
    messages,
    input,
    isLoading,
    error,
    handleInputChange,
    handleSubmit,
  } = useChat();

  const onInputChange = (value: string) => {
    handleInputChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e);
  };

  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
        <p className="text-red-800">
          Une erreur s'est produite lors de la communication avec l'assistant.
        </p>
        <p className="text-sm text-red-600 mt-1">{error.message}</p>
      </div>
    );
  }

  return (
    <ChatInterface
      messages={messages}
      input={input}
      isLoading={isLoading}
      onInputChange={onInputChange}
      onSubmit={onSubmit}
    />
  );
} 