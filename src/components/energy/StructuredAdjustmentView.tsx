import React from "react";
import { DirectiveType, StructuredAdjustment } from "@/lib/types/gridwise";
import { Clock, Sliders, Battery, Gauge, XCircle } from "lucide-react";

interface StructuredAdjustmentViewProps {
  directiveType: DirectiveType;
  adjustment: StructuredAdjustment;
  className?: string;
}

function formatHourRange(hours: number[]): string {
  if (!hours || hours.length === 0) return "";
  const start = hours[0];
  const end = hours[hours.length - 1] + 1;

  const formatAmPm = (h: number) => {
    const period = h >= 12 && h < 24 ? "PM" : "AM";
    const modH = h % 12 === 0 ? 12 : h % 12;
    return `${modH} ${period}`;
  };

  return `${formatAmPm(start)} – ${formatAmPm(end)} (${start.toString().padStart(2, "0")}:00–${end.toString().padStart(2, "0")}:00)`;
}

export function StructuredAdjustmentView({
  directiveType,
  adjustment,
  className = "",
}: StructuredAdjustmentViewProps) {
  if (directiveType === "no_op" || adjustment === null) {
    return (
      <div className={`p-2.5 rounded-xl border border-border/60 bg-secondary/20 font-mono text-xs text-muted-foreground flex items-center gap-2 ${className}`}>
        <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>structured_adjustment: null (Safe distractor, no energy schedule impact)</span>
      </div>
    );
  }

  const hours = adjustment.hours || [];
  const hoursRangeText = formatHourRange(hours);

  return (
    <div className={`p-3 rounded-xl border border-border/80 bg-secondary/30 font-mono text-xs space-y-2 ${className}`}>
      {/* Affected Hours Window */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-2">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="w-3.5 h-3.5 text-[#E5B25D]" />
          <span className="font-semibold text-foreground">Window:</span>
          <span>[{hours.join(", ")}]</span>
        </div>
        <span className="text-[11px] text-[#E5B25D] font-medium">
          {hoursRangeText}
        </span>
      </div>

      {/* Numeric Parameter Fields */}
      <div className="flex flex-wrap items-center gap-4 text-xs pt-0.5">
        {"factor" in adjustment && (
          <div className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-[#E5B25D]" />
            <span className="text-muted-foreground">factor:</span>
            <span className="font-bold text-[#E5B25D]">
              {(adjustment as any).factor} ({Math.round((adjustment as any).factor * 100)}% Usable Solar)
            </span>
          </div>
        )}

        {"minimum_energy_kwh" in adjustment && (
          <div className="flex items-center gap-1.5">
            <Battery className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-muted-foreground">minimum_energy_kwh:</span>
            <span className="font-bold text-teal-400">
              {(adjustment as any).minimum_energy_kwh} kWh
            </span>
          </div>
        )}

        {"max_grid_kwh" in adjustment && (
          <div className="flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-muted-foreground">max_grid_kwh:</span>
            <span className="font-bold text-slate-300">
              {(adjustment as any).max_grid_kwh} kWh
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
