import React from "react";
import { Sparkles, User } from "lucide-react";

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const isAssistant = message.sender === "assistant";

  return (
    <div
      className={`flex items-start gap-2.5 text-xs font-mono ${
        isAssistant ? "justify-start" : "justify-end"
      }`}
    >
      {isAssistant && (
        <div className="w-6 h-6 rounded-full bg-secondary/80 border border-border/80 flex items-center justify-center text-[#E5B25D] shrink-0 mt-0.5">
          <Sparkles className="w-3 h-3" />
        </div>
      )}

      <div
        className={`max-w-[85%] rounded-2xl p-3 leading-relaxed space-y-1 ${
          isAssistant
            ? "bg-card border border-border text-foreground shadow-xs"
            : "bg-[#1B241F] text-[#E5B25D] border border-[#3A4B40] font-sans font-medium"
        }`}
      >
        <div className="whitespace-pre-wrap">{message.text}</div>
        <div
          className={`text-[9px] text-right ${
            isAssistant ? "text-muted-foreground" : "text-[#E5B25D]/70"
          }`}
        >
          {message.timestamp}
        </div>
      </div>

      {!isAssistant && (
        <div className="w-6 h-6 rounded-full bg-secondary/80 border border-border/80 flex items-center justify-center shrink-0 mt-0.5 text-foreground">
          <User className="w-3 h-3" />
        </div>
      )}
    </div>
  );
}
