export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
  isNew?: boolean;
}

export interface ChatApiMessage {
  role: string;
  content: string;
}

type SerializedChatMessage = Omit<ChatMessage, "timestamp" | "isNew"> & {
  timestamp?: string;
};

const VALID_ROLES = new Set(["user", "assistant"]);

export function deserializeChatMessages(parsed: unknown): ChatMessage[] | null {
  if (!Array.isArray(parsed) || parsed.length === 0) return null;
  return (parsed as SerializedChatMessage[]).map((m) => ({
    ...m,
    timestamp: m.timestamp ? new Date(m.timestamp) : undefined,
  }));
}

export function typewriterSpeed(contentLength: number): number {
  return Math.max(4, Math.min(18, Math.round(3000 / contentLength)));
}

export function validateChatMessages(messages: unknown): string | null {
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 20) {
    return "메시지를 입력해주세요.";
  }
  for (const msg of messages) {
    if (
      typeof msg !== "object" ||
      msg === null ||
      !VALID_ROLES.has((msg as ChatApiMessage).role) ||
      typeof (msg as ChatApiMessage).content !== "string" ||
      (msg as ChatApiMessage).content.length === 0 ||
      (msg as ChatApiMessage).content.length > 500
    ) {
      return "올바르지 않은 메시지 형식입니다.";
    }
  }
  return null;
}

export function toChatHistory(
  messages: ChatApiMessage[]
): { role: string; parts: { text: string }[] }[] {
  return messages.slice(0, -1).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
}
