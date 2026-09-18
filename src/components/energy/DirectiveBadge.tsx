import React from "react";
import { DirectiveType } from "@/lib/types/gridwise";
import { Sun, BatteryCharging, Ban, ShieldAlert, Zap, MinusCircle } from "lucide-react";

interface DirectiveBadgeProps {
  type: DirectiveType;
  className?: string;
}

export function DirectiveBadge({ type, className = "" }: DirectiveBadgeProps) {
  const baseClasses = `inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-normal uppercase tracking-wider border transition-colors select-none ${className}`;

  switch (type) {
    case "solar_reduction":
      return (
        <span
          className={baseClasses}
          style={{
            borderColor: "rgba(229, 178, 93, 0.35)",
            color: "#E5B25D",
            backgroundColor: "rgba(229, 178, 93, 0.1)",
          }}
        >
          <Sun className="w-3 h-3" />
          <span>solar_reduction</span>
        </span>
      );

    case "minimum_battery_reserve":
      return (
        <span
          className={baseClasses}
          style={{
            borderColor: "rgba(45, 212, 191, 0.35)",
            color: "#2DD4BF",
            backgroundColor: "rgba(45, 212, 191, 0.1)",
          }}
        >
          <BatteryCharging className="w-3 h-3" />
          <span>minimum_battery_reserve</span>
        </span>
      );

    case "no_charge_window":
      return (
        <span
          className={baseClasses}
          style={{
            borderColor: "rgba(167, 139, 250, 0.35)",
            color: "#A78BFA",
            backgroundColor: "rgba(167, 139, 250, 0.1)",
          }}
        >
          <Ban className="w-3 h-3" />
          <span>no_charge_window</span>
        </span>
      );

    case "no_discharge_window":
      return (
        <span
          className={baseClasses}
          style={{
            borderColor: "rgba(251, 113, 133, 0.35)",
            color: "#FB7185",
            backgroundColor: "rgba(251, 113, 133, 0.1)",
          }}
        >
          <ShieldAlert className="w-3 h-3" />
          <span>no_discharge_window</span>
        </span>
      );

    case "max_grid_window":
      return (
        <span
          className={baseClasses}
          style={{
            borderColor: "rgba(148, 163, 184, 0.35)",
            color: "#94A3B8",
            backgroundColor: "rgba(148, 163, 184, 0.1)",
          }}
        >
          <Zap className="w-3 h-3" />
          <span>max_grid_window</span>
        </span>
      );

    case "no_op":
    default:
      return (
        <span
          className={baseClasses}
          style={{
            borderColor: "rgba(148, 163, 184, 0.25)",
            color: "#94A3B8",
            backgroundColor: "rgba(148, 163, 184, 0.08)",
          }}
        >
          <MinusCircle className="w-3 h-3" />
          <span>no_op</span>
        </span>
      );
  }
}
