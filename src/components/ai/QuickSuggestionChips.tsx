"use client";

import React from "react";
import { MessageSquarePlus } from "lucide-react";

interface QuickSuggestionChipsProps {
  onSelectPrompt: (promptText: string) => void;
  disabled?: boolean;
}

export const CANONICAL_ASSISTANT_PROMPTS = [
  "Why did the battery discharge during peak tariff hours?",
  "How did the active operator directives affect total grid cost?",
  "Summarize the solar utilization and curtailment in this schedule.",
  "Explain how end-of-day battery neutrality was maintained.",
];

export function QuickSuggestionChips({
  onSelectPrompt,
  disabled = false,
}: QuickSuggestionChipsProps) {
  return (
    <div className="space-y-1.5 font-mono">
      <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
        <MessageSquarePlus className="w-3 h-3 text-primary" />
        <span>Suggested Explanatory Queries:</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {CANONICAL_ASSISTANT_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onSelectPrompt(prompt)}
            className="text-left text-[11px] px-2.5 py-1.5 rounded-lg border border-border/70 bg-secondary/50 hover:bg-secondary hover:border-primary/50 text-foreground transition-all duration-150 disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
