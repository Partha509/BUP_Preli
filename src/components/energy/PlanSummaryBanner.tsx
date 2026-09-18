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
      <div className={`rounded-xl border border-border bg-card p-4 space-y-2 ${className}`}>
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
      className={`relative rounded-xl border border-primary/30 bg-primary/5 p-4 md:p-5 space-y-3 transition-all ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-primary/20 text-primary">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-xs text-foreground tracking-wide uppercase font-mono">
              Optimization Plan Strategy Summary
            </h3>
            <span className="text-[11px] text-muted-foreground font-mono">
              Machine-generated narrative synthesis from POST /optimize-energy
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border/80 bg-secondary/80 hover:bg-secondary text-muted-foreground hover:text-foreground text-xs font-mono transition-colors"
          title="Copy plan summary to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-500">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Summary</span>
            </>
          )}
        </button>
      </div>

      <div className="p-3.5 rounded-lg border border-primary/20 bg-background/60 text-xs md:text-sm text-foreground/90 font-mono leading-relaxed relative flex items-start gap-2.5">
        <Terminal className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p className="whitespace-pre-wrap">{activeResponse.plan_summary}</p>
      </div>
    </div>
  );
}
