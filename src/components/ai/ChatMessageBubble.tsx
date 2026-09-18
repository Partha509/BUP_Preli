import React from "react";
import { Sparkles, User, Terminal } from "lucide-react";

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
        <div className="p-1.5 rounded-md bg-primary/10 text-primary border border-primary/20 shrink-0 mt-0.5">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      )}

      <div
        className={`max-w-[85%] rounded-xl p-3 leading-relaxed space-y-1 ${
          isAssistant
            ? "bg-secondary/70 border border-border text-foreground shadow-2xs"
            : "bg-primary text-primary-foreground font-sans font-medium"
        }`}
      >
        <div className="whitespace-pre-wrap">{message.text}</div>
        <div
          className={`text-[10px] text-right ${
            isAssistant ? "text-muted-foreground" : "text-primary-foreground/70"
          }`}
        >
          {message.timestamp}
        </div>
      </div>

      {!isAssistant && (
        <div className="p-1.5 rounded-md bg-secondary border border-border shrink-0 mt-0.5 text-foreground">
          <User className="w-3.5 h-3.5" />
        </div>
      )}
    </div>
  );
}
