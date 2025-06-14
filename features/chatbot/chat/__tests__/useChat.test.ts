import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useChat } from "../hooks/useChat";

// Mock the ai/react module
vi.mock("ai/react", () => ({
  useChat: vi.fn(),
}));

describe("useChat", () => {
  const mockUseAIChat = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    const { useChat: useAIChat } = require("ai/react");
    useAIChat.mockImplementation(mockUseAIChat);
  });

  it("should initialize with empty messages", () => {
    mockUseAIChat.mockReturnValue({
      messages: [],
      input: "",
      handleInputChange: vi.fn(),
      handleSubmit: vi.fn(),
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useChat());

    expect(result.current.messages).toEqual([]);
    expect(result.current.input).toBe("");
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should transform AI messages to our Message format", () => {
    const mockAIMessages = [
      {
        id: "1",
        role: "user",
        content: "Hello",
        createdAt: new Date("2024-01-01T10:00:00Z"),
      },
      {
        id: "2",
        role: "assistant",
        content: "Hi there!",
        createdAt: new Date("2024-01-01T10:00:01Z"),
      },
    ];

    mockUseAIChat.mockReturnValue({
      messages: mockAIMessages,
      input: "",
      handleInputChange: vi.fn(),
      handleSubmit: vi.fn(),
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useChat());

    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages[0]).toEqual({
      id: "1",
      role: "user",
      content: "Hello",
      timestamp: new Date("2024-01-01T10:00:00Z"),
    });
    expect(result.current.messages[1]).toEqual({
      id: "2",
      role: "assistant",
      content: "Hi there!",
      timestamp: new Date("2024-01-01T10:00:01Z"),
    });
  });

  it("should handle messages without createdAt", () => {
    const mockAIMessages = [
      {
        id: "1",
        role: "user",
        content: "Hello",
        // No createdAt property
      },
    ];

    mockUseAIChat.mockReturnValue({
      messages: mockAIMessages,
      input: "",
      handleInputChange: vi.fn(),
      handleSubmit: vi.fn(),
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useChat());

    expect(result.current.messages[0].timestamp).toBeInstanceOf(Date);
  });
}); 