"use client";

import React from "react";
import { useScenario } from "@/context/ScenarioContext";
import { DirectiveBadge } from "./DirectiveBadge";
import { StructuredAdjustmentView } from "./StructuredAdjustmentView";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Quote,
  Sparkles,
  Info,
  Layers,
} from "lucide-react";

export function DirectiveInterpretationList({ className = "" }: { className?: string }) {
  const {
    activeRequest,
    activeResponse,
    isLoading,
    highlightedHours,
    setHighlightedHours,
  } = useScenario();

  if (isLoading) {
    return (
      <div className={`rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 ${className}`}>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#E5B25D] animate-spin" />
          <h3 className="font-medium text-xs tracking-wider uppercase">Interpreting Directives via Backend LLM...</h3>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!activeResponse) {
    return (
      <div
        className={`rounded-2xl border border-dashed border-border bg-card/40 p-8 text-center space-y-3 ${className}`}
      >
        <div className="w-10 h-10 rounded-full bg-secondary/80 border border-border/80 flex items-center justify-center mx-auto text-muted-foreground">
          <Layers className="w-5 h-5 text-[#E5B25D]" />
        </div>
        <div className="space-y-1">
          <h3 className="font-normal text-xs uppercase tracking-[0.12em] text-foreground">No Directives Interpreted Yet</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Click &quot;Optimize Energy&quot; to execute POST /optimize-energy and inspect the machine-checkable directive interpretations.
          </p>
        </div>
      </div>
    );
  }

  const interpretations = activeResponse.directive_interpretation || [];

  return (
    <div
      id="demo-section-directives"
      className={`rounded-2xl border border-border bg-card p-4 sm:p-5 md:p-6 space-y-5 shadow-xs transition-all duration-300 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-secondary/80 border border-border/80 flex items-center justify-center text-[#E5B25D]">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-normal text-[11px] text-foreground tracking-[0.12em] uppercase font-mono">
              LLM Directive Interpretation & Guardrails
            </h3>
            <p className="text-[10px] text-muted-foreground font-mono">
              Backend validated structured interpretations &bull; Returned in note_index order (0..N-1)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
          <span className="text-[#E5B25D] font-bold">{interpretations.length}</span>
          <span className="uppercase tracking-wider">Interpreted</span>
        </div>
      </div>

      {/* List of Directive Cards */}
      <div className="space-y-3.5">
        {interpretations.map((item) => {
          const originalNote =
            activeRequest.operator_notes[item.note_index] ||
            "Original operator note text unavailable.";
          const hours = item.structured_adjustment?.hours || [];
          const isHighlighted =
            highlightedHours &&
            hours.length > 0 &&
            hours.some((h) => highlightedHours.includes(h));

          return (
            <div
              key={item.note_index}
              onMouseEnter={() => hours.length > 0 && setHighlightedHours(hours)}
              onMouseLeave={() => setHighlightedHours(null)}
              className={`rounded-2xl border p-4 space-y-3 transition-all ${
                isHighlighted
                  ? "border-[#3A4B40] bg-[#1B241F] shadow-xs"
                  : "border-border bg-secondary/20 hover:border-strong-border"
              }`}
            >
              {/* Row 1: Note Index & Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-medium tracking-wider uppercase text-foreground bg-card px-2.5 py-0.5 rounded-full border border-border">
                    Note #{item.note_index}
                  </span>
                  <DirectiveBadge type={item.directive_type} />
                </div>

                {/* Application Status Pill */}
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  {item.applies ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>applies: true</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-slate-400 text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-secondary border border-border">
                      <XCircle className="w-3 h-3" />
                      <span>applies: false (no_op)</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Row 2: Original Operator Note Quote */}
              <div className="p-3 rounded-xl bg-card border border-border/60 text-xs text-foreground/90 italic flex items-start gap-2">
                <Quote className="w-3 h-3 text-[#E5B25D] shrink-0 mt-0.5 not-italic" />
                <span>&ldquo;{originalNote}&rdquo;</span>
              </div>

              {/* Row 3: Structured Adjustment Telemetry */}
              <StructuredAdjustmentView
                directiveType={item.directive_type}
                adjustment={item.structured_adjustment}
              />

              {/* Row 4: Guardrail Verification & Explanation */}
              <div className="pt-2 border-t border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Info className="w-3 h-3 text-[#E5B25D] shrink-0" />
                  <span className="text-foreground/80 text-[11.5px]">{item.explanation}</span>
                </div>

                {/* Backend Guardrail Indicator */}
                <div className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-emerald-400 shrink-0 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Guardrails Verified</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
