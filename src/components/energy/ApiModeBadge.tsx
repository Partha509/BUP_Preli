"use client";

import React from "react";
import { useScenario } from "@/context/ScenarioContext";
import { Radio, Database } from "lucide-react";

export function ApiModeBadge({ className = "" }: { className?: string }) {
  const { useMockFallback, setUseMockFallback, isLoading } = useScenario();

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full p-0.5 border border-border bg-secondary/60 text-[10px] font-mono select-none ${className}`}
      title={
        useMockFallback
          ? "Offline Dev Mode: Uses canonical mock responses without network calls"
          : "Live API Mode: Dispatches requests directly to POST /optimize-energy"
      }
    >
      <button
        type="button"
        disabled={isLoading}
        onClick={() => setUseMockFallback(false)}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-full uppercase tracking-wider transition-colors cursor-pointer ${
          !useMockFallback
            ? "bg-[#1B241F] text-[#E5B25D] border border-[#3A4B40] font-normal shadow-xs"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Radio className="w-2.5 h-2.5" />
        <span>LIVE API</span>
      </button>

      <button
        type="button"
        disabled={isLoading}
        onClick={() => setUseMockFallback(true)}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-full uppercase tracking-wider transition-colors cursor-pointer ${
          useMockFallback
            ? "bg-[#1B241F] text-[#E5B25D] border border-[#3A4B40] font-normal shadow-xs"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Database className="w-2.5 h-2.5" />
        <span>DEV MOCK</span>
      </button>
    </div>
  );
}
