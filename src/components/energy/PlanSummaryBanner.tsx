"use client";

import React, { useState } from "react";
import { useScenario } from "@/context/ScenarioContext";
import { Sparkles, Copy, Check, Terminal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface PlanSummaryBannerProps {
  className?: string;
}

export function PlanSummaryBanner({ className = "" }: PlanSummaryBannerProps) {
  const { activeResponse, isLoading } = useScenario();
  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return (
      <div className={`rounded-2xl border border-border bg-card p-4 space-y-2 ${className}`}>
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (!activeResponse || !activeResponse.plan_summary) {
    return null;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeResponse.plan_summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard write failure fallback
    }
  };

  return (
    <div
      className={`relative rounded-2xl border border-border bg-card p-4 sm:p-5 space-y-3 transition-all shadow-xs ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-secondary/80 border border-border/80 flex items-center justify-center text-[#E5B25D]">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-normal text-[11px] text-foreground tracking-[0.12em] uppercase font-mono">
              Optimization Plan Strategy Summary
            </h3>
            <span className="text-[10px] text-muted-foreground font-mono">
              Automated narrative synthesis from POST /optimize-energy
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground text-[11px] font-mono uppercase tracking-wider transition-colors cursor-pointer"
          title="Copy plan summary to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-500" />
              <span className="text-emerald-500">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy Summary</span>
            </>
          )}
        </button>
      </div>

      <div className="p-3.5 rounded-xl border border-border/60 bg-secondary/30 text-xs text-foreground/90 font-mono leading-relaxed relative flex items-start gap-2.5">
        <Terminal className="w-3.5 h-3.5 text-[#E5B25D] shrink-0 mt-0.5" />
        <p className="whitespace-pre-wrap">{activeResponse.plan_summary}</p>
      </div>
    </div>
  );
}
