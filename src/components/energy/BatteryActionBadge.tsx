import React from "react";
import { BatteryAction } from "@/lib/types/gridwise";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface BatteryActionBadgeProps {
  action: BatteryAction;
  kwh: number;
  className?: string;
}

export function BatteryActionBadge({
  action,
  kwh,
  className = "",
}: BatteryActionBadgeProps) {
  if (action === "charge") {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 ${className}`}
      >
        <ArrowDownRight className="w-3.5 h-3.5" />
        <span>CHARGE +{kwh.toFixed(2)}k</span>
      </span>
    );
  }

  if (action === "discharge") {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ${className}`}
      >
        <ArrowUpRight className="w-3.5 h-3.5" />
        <span>DISCH -{kwh.toFixed(2)}k</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-xs text-muted-foreground bg-secondary/50 border border-border/40 ${className}`}
    >
      <Minus className="w-3 h-3 text-slate-400" />
      <span>IDLE (0.00)</span>
    </span>
  );
}
