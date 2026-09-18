"use client";

import React from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BatteryCharging, ShieldCheck } from "lucide-react";
import { useScenario } from "@/context/ScenarioContext";

export function BatteryParametersDrawer({ className = "" }: { className?: string }) {
  const { activeRequest, updateBatteryParams } = useScenario();
  const battery = activeRequest.battery;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`gap-1.5 text-[11px] font-mono tracking-wider uppercase rounded-full border border-border/80 bg-secondary/40 px-3 h-8 sm:h-9 ${className}`}
        >
          <BatteryCharging className="w-3 h-3 text-teal-400" />
          <span>BESS Parameters</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[340px] sm:w-[400px] flex flex-col p-6 bg-card border-l border-border text-foreground">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-foreground">
            <BatteryCharging className="w-4 h-4 text-teal-400" />
            <span>Battery Parameters</span>
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Hardware limits matching Section 7.3 of the canonical specification.
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-3.5 font-mono text-xs flex-1 overflow-y-auto">
          {/* Capacity */}
          <div className="space-y-1.5 p-3 rounded-xl border border-border/80 bg-secondary/30">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-foreground">capacity_kwh</label>
              <span className="text-[10px] text-muted-foreground">Max Storage</span>
            </div>
            <Input
              type="number"
              value={battery.capacity_kwh}
              onChange={(e) => updateBatteryParams({ capacity_kwh: Number(e.target.value) || 0 })}
              className="font-mono h-8 text-xs bg-card/60"
            />
            <p className="text-[11px] text-muted-foreground font-sans">
              Maximum energy the battery can store.
            </p>
          </div>

          {/* Initial Energy */}
          <div className="space-y-1.5 p-3 rounded-xl border border-border/80 bg-secondary/30">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-foreground">initial_energy_kwh</label>
              <span className="text-[10px] text-muted-foreground">Hour 0 Level</span>
            </div>
            <Input
              type="number"
              value={battery.initial_energy_kwh}
              onChange={(e) => updateBatteryParams({ initial_energy_kwh: Number(e.target.value) || 0 })}
              className="font-mono h-8 text-xs bg-card/60"
            />
            <p className="text-[11px] text-muted-foreground font-sans">
              Battery energy at the start of hour 0. Must equal hour 23 final energy.
            </p>
          </div>

          {/* Minimum Energy Reserve */}
          <div className="space-y-1.5 p-3 rounded-xl border border-border/80 bg-secondary/30">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-foreground">minimum_energy_kwh</label>
              <span className="text-[10px] text-muted-foreground">Safety Floor</span>
            </div>
            <Input
              type="number"
              value={battery.minimum_energy_kwh}
              onChange={(e) => updateBatteryParams({ minimum_energy_kwh: Number(e.target.value) || 0 })}
              className="font-mono h-8 text-xs bg-card/60"
            />
            <p className="text-[11px] text-muted-foreground font-sans">
              Base reserve level the battery must never drop below.
            </p>
          </div>

          {/* Max Charge Rate */}
          <div className="space-y-1.5 p-3 rounded-xl border border-border/80 bg-secondary/30">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-foreground">max_charge_kwh_per_hour</label>
              <span className="text-[10px] text-muted-foreground">C-Rate Limit</span>
            </div>
            <Input
              type="number"
              value={battery.max_charge_kwh_per_hour}
              onChange={(e) => updateBatteryParams({ max_charge_kwh_per_hour: Number(e.target.value) || 0 })}
              className="font-mono h-8 text-xs bg-card/60"
            />
            <p className="text-[11px] text-muted-foreground font-sans">
              Maximum energy added in one single hour.
            </p>
          </div>

          {/* Max Discharge Rate */}
          <div className="space-y-1.5 p-3 rounded-xl border border-border/80 bg-secondary/30">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-foreground">max_discharge_kwh_per_hour</label>
              <span className="text-[10px] text-muted-foreground">Discharge Limit</span>
            </div>
            <Input
              type="number"
              value={battery.max_discharge_kwh_per_hour}
              onChange={(e) => updateBatteryParams({ max_discharge_kwh_per_hour: Number(e.target.value) || 0 })}
              className="font-mono h-8 text-xs bg-card/60"
            />
            <p className="text-[11px] text-muted-foreground font-sans">
              Maximum energy removed in one single hour.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-border flex items-center gap-2 text-[11px] text-muted-foreground font-sans">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Battery state is replayed deterministically hour-by-hour during evaluation.</span>
        </div>
      </SheetContent>
    </Sheet>
  );
}
