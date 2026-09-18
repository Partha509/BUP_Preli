import React from "react";
import { BatteryAction } from "@/lib/types/gridwise";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface BatteryActionBadgeProps {
  action: BatteryAction;
  kwh?: number;
  amountKwh?: number;
  className?: string;
}

export function BatteryActionBadge({
  action,
  kwh,
  amountKwh,
  className = "",
}: BatteryActionBadgeProps) {
  const val = amountKwh ?? kwh ?? 0;

  if (action === "charge") {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-medium uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/30 ${className}`}
      >
        <ArrowDownRight className="w-3 h-3" />
        <span>CHG +{val.toFixed(2)}k</span>
      </span>
    );
  }

  if (action === "discharge") {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-medium uppercase tracking-wider bg-teal-500/10 text-teal-400 border border-teal-500/30 ${className}`}
      >
        <ArrowUpRight className="w-3 h-3" />
        <span>DIS -{val.toFixed(2)}k</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-normal uppercase tracking-wider text-muted-foreground bg-secondary/50 border border-border/60 ${className}`}
    >
      <Minus className="w-2.5 h-2.5 text-muted-foreground" />
      <span>IDLE 0.00</span>
    </span>
  );
}
