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
      <div className="p-3 sm:p-3.5 rounded-2xl border border-[#3A4B40] bg-[#1B241F] flex items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2.5">
          <UserCheck className="w-4 h-4 text-[#E5B25D] shrink-0" />
          <span className="text-[#9EA8A2] text-[11.5px]">
            <strong className="text-[#E5B25D] font-medium uppercase tracking-wider">Operator Console Mode:</strong>{" "}
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

      {/* 3. Directive Interpretation & Guardrail Visualizer */}
      <section id="directives" className="scroll-mt-24">
        <DirectiveInterpretationList />
      </section>

      {/* 4. 24-Hour Schedule Inspection Table */}
      <section id="schedule" className="scroll-mt-24">
        <HourlyScheduleTable />
      </section>

      {/* 5. Secondary Dispatch Timeline & KPIs */}
      <div className="pt-4 border-t border-border space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-[11px] font-mono uppercase tracking-[0.14em] text-muted-foreground">
            Schedule Overview & High-Level KPIs
          </h4>
        </div>
        <OptimizationMetricsHeader />
        <EnergyDispatchChart />
      </div>
    </div>
  );
}
