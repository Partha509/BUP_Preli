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
      <div className={`rounded-xl border border-border bg-card p-6 space-y-4 ${className}`}>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary animate-spin" />
          <h3 className="font-semibold text-sm">Interpreting Directives via Backend LLM...</h3>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      </div>
    );
  }

  if (!activeResponse) {
    return (
      <div
        className={`rounded-xl border border-dashed border-border bg-card/40 p-8 text-center space-y-3 ${className}`}
      >
        <div className="p-3 rounded-full bg-secondary/80 border border-border w-fit mx-auto text-muted-foreground">
          <Layers className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-sm text-foreground">No Directives Interpreted Yet</h3>
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
      className={`rounded-xl border border-border bg-card p-5 md:p-6 space-y-5 transition-all duration-300 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-primary/10 text-primary">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">LLM Directive Interpretation & Guardrails</h3>
            <p className="text-xs text-muted-foreground">
              Backend validated structured interpretations &bull; Returned in note_index order (0..N-1)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <span className="text-primary font-bold">{interpretations.length}</span>
          <span>Interpreted</span>
        </div>
      </div>

      {/* List of Directive Cards */}
      <div className="space-y-4">
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
              className={`rounded-xl border p-4 space-y-3 transition-all duration-150 ${
                isHighlighted
                  ? "border-primary bg-primary/5 shadow-xs"
                  : "border-border bg-card hover:border-border/80"
              }`}
            >
              {/* Row 1: Note Index & Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-muted-foreground bg-secondary px-2 py-0.5 rounded border border-border">
                    Note #{item.note_index}
                  </span>
                  <DirectiveBadge type={item.directive_type} />
                </div>

                {/* Application Status Pill */}
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  {item.applies ? (
                    <span className="inline-flex items-center gap-1 text-emerald-500 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>applies: true</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-slate-400 font-medium px-2 py-0.5 rounded bg-slate-500/10 border border-slate-500/20">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>applies: false (no_op)</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Row 2: Original Operator Note Quote */}
              <div className="p-3 rounded-lg bg-secondary/30 border border-border/60 text-xs text-foreground/90 italic flex items-start gap-2">
                <Quote className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5 not-italic" />
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
                  <Info className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="text-foreground/80">{item.explanation}</span>
                </div>

                {/* Backend Guardrail Indicator */}
                <div className="flex items-center gap-1 font-mono text-[11px] text-emerald-500 shrink-0 font-medium">
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
