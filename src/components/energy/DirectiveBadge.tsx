import React from "react";
import { DirectiveType } from "@/lib/types/gridwise";
import { Sun, BatteryCharging, Ban, ShieldAlert, Zap, MinusCircle } from "lucide-react";

interface DirectiveBadgeProps {
  type: DirectiveType;
  className?: string;
}

export function DirectiveBadge({ type, className = "" }: DirectiveBadgeProps) {
  switch (type) {
    case "solar_reduction":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-mono text-xs font-bold border transition-colors ${className}`}
          style={{
            borderColor: "var(--directive-solar)",
            color: "var(--directive-solar)",
            backgroundColor: "rgba(251, 191, 36, 0.12)",
          }}
        >
          <Sun className="w-3.5 h-3.5" />
          <span>solar_reduction</span>
        </span>
      );

    case "minimum_battery_reserve":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-mono text-xs font-bold border transition-colors ${className}`}
          style={{
            borderColor: "var(--directive-reserve)",
            color: "var(--directive-reserve)",
            backgroundColor: "rgba(56, 189, 248, 0.12)",
          }}
        >
          <BatteryCharging className="w-3.5 h-3.5" />
          <span>minimum_battery_reserve</span>
        </span>
      );

    case "no_charge_window":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-mono text-xs font-bold border transition-colors ${className}`}
          style={{
            borderColor: "var(--directive-nocharge)",
            color: "var(--directive-nocharge)",
            backgroundColor: "rgba(167, 139, 250, 0.12)",
          }}
        >
          <Ban className="w-3.5 h-3.5" />
          <span>no_charge_window</span>
        </span>
      );

    case "no_discharge_window":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-mono text-xs font-bold border transition-colors ${className}`}
          style={{
            borderColor: "var(--directive-nodischarge)",
            color: "var(--directive-nodischarge)",
            backgroundColor: "rgba(251, 113, 133, 0.12)",
          }}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>no_discharge_window</span>
        </span>
      );

    case "max_grid_window":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-mono text-xs font-bold border transition-colors ${className}`}
          style={{
            borderColor: "var(--directive-gridcap)",
            color: "var(--directive-gridcap)",
            backgroundColor: "rgba(129, 140, 248, 0.12)",
          }}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>max_grid_window</span>
        </span>
      );

    case "no_op":
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-mono text-xs font-bold border transition-colors ${className}`}
          style={{
            borderColor: "var(--directive-noop)",
            color: "var(--directive-noop)",
            backgroundColor: "rgba(148, 163, 184, 0.12)",
          }}
        >
          <MinusCircle className="w-3.5 h-3.5" />
          <span>no_op</span>
        </span>
      );
  }
}
