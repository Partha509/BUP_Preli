"use client";

import React from "react";
import { useScenario } from "@/context/ScenarioContext";
import { Radio, Database, RefreshCw } from "lucide-react";

export function ApiModeBadge({ className = "" }: { className?: string }) {
  const { useMockFallback, setUseMockFallback, isLoading } = useScenario();

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full p-0.5 border border-border bg-secondary/40 text-[11px] font-mono ${className}`}
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
        className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-colors ${
          !useMockFallback
            ? "bg-primary text-primary-foreground font-semibold shadow-xs"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Radio className="w-3 h-3" />
        <span>LIVE API</span>
      </button>

      <button
        type="button"
        disabled={isLoading}
        onClick={() => setUseMockFallback(true)}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-colors ${
          useMockFallback
            ? "bg-amber-500/20 text-amber-500 font-semibold border border-amber-500/30"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Database className="w-3 h-3" />
        <span>DEV MOCK</span>
      </button>
    </div>
  );
}
