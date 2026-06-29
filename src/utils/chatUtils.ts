export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
  isNew?: boolean;
}

type SerializedChatMessage = Omit<ChatMessage, "timestamp" | "isNew"> & {
  timestamp?: string;
};

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
