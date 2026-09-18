"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface AssistantTriggerButtonProps {
  onClick: () => void;
  isOpen: boolean;
  className?: string;
}

export function AssistantTriggerButton({
  onClick,
  isOpen,
  className = "",
}: AssistantTriggerButtonProps) {
  if (isOpen) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-40 ${className}`}>
      <button
        type="button"
        onClick={onClick}
        aria-label="Open GridWise Explanatory Copilot"
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-primary text-primary-foreground font-mono text-xs font-semibold shadow-xl hover:shadow-primary/30 hover:scale-105 active:scale-95 transition-all duration-200 border border-primary-foreground/20"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
        </span>

        <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12" />
        <span className="hidden sm:inline">AI Copilot</span>
      </button>
    </div>
  );
}
