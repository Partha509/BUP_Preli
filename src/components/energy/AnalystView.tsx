"use client";

import React from "react";
import { OptimizationMetricsHeader } from "./OptimizationMetricsHeader";
import { PlanSummaryBanner } from "./PlanSummaryBanner";
import { EnergyDispatchChart } from "./EnergyDispatchChart";
import { DirectiveInterpretationList } from "./DirectiveInterpretationList";
import { HourlyScheduleTable } from "./HourlyScheduleTable";
import { ScenarioControlBar } from "./ScenarioControlBar";
import { ApiErrorAlert } from "./ApiErrorAlert";
import { BarChart3 } from "lucide-react";

export function AnalystView() {
  return (
    <div className="space-y-6">
      {/* Analyst Role Focus Header Banner */}
      <div className="p-3.5 rounded-lg border border-indigo-500/20 bg-indigo-500/5 flex items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-indigo-400" />
          <span>
            <strong className="text-foreground font-semibold">Grid Analyst & Compliance Mode:</strong>{" "}
            Prioritizing financial cost analytics, peak grid avoidance, tariff arbitrage curves, and plan synthesis.
          </span>
        </div>
      </div>

      {/* Error alert if any */}
      <ApiErrorAlert />

      {/* 1. Quick Scenario Bar */}
      <ScenarioControlBar />

      {/* 2. Top-Level Optimization KPI Metrics */}
      <OptimizationMetricsHeader />

      {/* 3. AI Optimization Plan Summary Banner */}
      <PlanSummaryBanner />

      {/* 4. Central 24-Hour Energy Dispatch Chart & Battery SoC Curve */}
      <EnergyDispatchChart />

      {/* 5. Directive Guardrail Verification Review */}
      <DirectiveInterpretationList />

      {/* 6. Comprehensive 24-Hour Schedule Inspection Table */}
      <HourlyScheduleTable />
    </div>
  );
}
