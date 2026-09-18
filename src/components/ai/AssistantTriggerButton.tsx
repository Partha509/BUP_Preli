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
        className="group relative flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#0E1311] text-[#E5B25D] border border-[#2D3A32] shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:border-[#3A4B40] hover:bg-[#151D19] active:scale-[0.98] transition-all text-xs font-mono uppercase tracking-[0.12em] select-none cursor-pointer"
      >
        <span className="relative flex h-2 w-2">
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E5B25D]" />
        </span>

        <Sparkles className="w-3.5 h-3.5 text-[#E5B25D]" />
        <span className="text-[#F3F5F4] font-medium tracking-wider">AI Copilot</span>
      </button>
    </div>
  );
}
