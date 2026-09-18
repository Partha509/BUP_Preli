"use client";

import React from "react";
import { ScenarioControlBar } from "./ScenarioControlBar";
import { OperatorNotesEditor } from "./OperatorNotesEditor";
import { DirectiveInterpretationList } from "./DirectiveInterpretationList";
import { HourlyScheduleTable } from "./HourlyScheduleTable";
import { OptimizationMetricsHeader } from "./OptimizationMetricsHeader";
import { EnergyDispatchChart } from "./EnergyDispatchChart";
import { ApiErrorAlert } from "./ApiErrorAlert";
import { UserCheck } from "lucide-react";

export function OperatorView() {
  return (
    <div className="space-y-6">
      {/* Operator Role Focus Header Banner */}
      <div className="p-3.5 rounded-lg border border-primary/20 bg-primary/5 flex items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-primary" />
          <span>
            <strong className="text-foreground font-semibold">Operator Console Mode:</strong>{" "}
            Prioritizing input parameters, natural language notes, directive validation, and operational schedule dispatch.
          </span>
        </div>
      </div>

      {/* Error alert if any */}
      <ApiErrorAlert />

      {/* 1. Primary Scenario Control Bar */}
      <ScenarioControlBar />

      {/* 2. Operator Notes Editor (1 to 3 notes) */}
      <OperatorNotesEditor />

      {/* 3. Directive Interpretation & Guardrail Visualizer (Crucial Operator Verification) */}
      <DirectiveInterpretationList />

      {/* 4. 24-Hour Schedule Inspection Table (Exact Dispatch Numbers) */}
      <HourlyScheduleTable />

      {/* 5. Secondary Dispatch Timeline & KPIs */}
      <div className="pt-4 border-t border-border space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-muted-foreground">
            Schedule Overview & High-Level KPIs
          </h4>
        </div>
        <OptimizationMetricsHeader />
        <EnergyDispatchChart />
      </div>
    </div>
  );
}
