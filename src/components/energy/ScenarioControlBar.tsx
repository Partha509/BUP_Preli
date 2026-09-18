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
      className={`rounded-xl border border-border bg-card p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 ${className}`}
    >
      {/* Left: Scenario Selector Dropdown */}
      <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground shrink-0">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          <span className="font-semibold text-foreground uppercase tracking-wider">Scenario:</span>
        </div>

        <div className="flex-1 max-w-md">
          <Select
            value={selectedScenarioId}
            onValueChange={(val) => selectScenario(val)}
          >
            <SelectTrigger className="font-mono text-xs h-9 bg-secondary/30">
              <SelectValue placeholder="Select a scenario preset" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              {scenarios.map((sc) => (
                <SelectItem key={sc.id} value={sc.id} className="font-mono text-xs">
                  <div className="flex items-center justify-between gap-4 w-full">
                    <span className="font-bold text-foreground">{sc.id}</span>
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
          className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
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
          variant="default"
          size="sm"
          loading={isLoading}
          onClick={() => executeOptimization()}
          className="h-9 px-4 text-xs font-bold gap-2 shadow-sm font-mono"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isLoading ? "Solving..." : "Optimize Energy"}</span>
        </Button>
      </div>
    </div>
  );
}
