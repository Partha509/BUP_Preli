"use client";

import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, SlidersHorizontal } from "lucide-react";
import { useScenario } from "@/context/ScenarioContext";
import { listSampleScenarios } from "@/lib/fixtures/sampleScenarios";
import { RawPayloadModal } from "./RawPayloadModal";
import { BatteryParametersDrawer } from "./BatteryParametersDrawer";

export function ScenarioControlBar({ className = "" }: { className?: string }) {
  const {
    selectedScenarioId,
    selectScenario,
    executeOptimization,
    isLoading,
    resetToDefault,
  } = useScenario();

  const scenarios = listSampleScenarios();

  return (
    <div
      className={`rounded-2xl border border-border bg-card p-3.5 sm:p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5 ${className}`}
    >
      {/* Left: Scenario Selector Dropdown */}
      <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground shrink-0 uppercase tracking-wider">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#E5B25D]" />
          <span className="font-medium text-foreground">Scenario:</span>
        </div>

        <div className="flex-1 max-w-md">
          <Select
            value={selectedScenarioId}
            onValueChange={(val) => selectScenario(val)}
          >
            <SelectTrigger className="font-mono text-xs h-8 sm:h-9 bg-secondary/50 border-border rounded-xl">
              <SelectValue placeholder="Select a scenario preset" />
            </SelectTrigger>
            <SelectContent className="max-h-80 rounded-xl border-border bg-card">
              {scenarios.map((sc) => (
                <SelectItem key={sc.id} value={sc.id} className="font-mono text-xs rounded-lg">
                  <div className="flex items-center justify-between gap-4 w-full">
                    <span className="font-semibold text-foreground">{sc.id}</span>
                    <span className="text-muted-foreground text-[11px] truncate max-w-[240px]">
                      {sc.label}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={resetToDefault}
          title="Reset to default GRID-101 scenario"
          className="h-8 sm:h-9 px-3 text-[11px] text-muted-foreground hover:text-foreground shrink-0 rounded-full border border-border/80 bg-secondary/30"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          <span>Reset</span>
        </Button>
      </div>

      {/* Right: Drawer Triggers & Main Optimize Button */}
      <div className="flex flex-wrap items-center gap-2.5 shrink-0 justify-end">
        {/* Hardware Battery Drawer */}
        <BatteryParametersDrawer />

        {/* View Raw Payload JSON Modal */}
        <RawPayloadModal />

        {/* Primary Action Button: Optimize Energy */}
        <Button
          variant="gold"
          size="sm"
          loading={isLoading}
          onClick={() => executeOptimization()}
          className="h-8 sm:h-9 px-4 text-xs font-semibold gap-1.5 shadow-xs font-mono tracking-wider uppercase rounded-full"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isLoading ? "Solving..." : "Optimize Energy"}</span>
        </Button>
      </div>
    </div>
  );
}
