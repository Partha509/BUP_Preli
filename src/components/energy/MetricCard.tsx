import React from "react";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtext?: React.ReactNode;
  icon: LucideIcon;
  iconColor?: string;
  badge?: React.ReactNode;
  className?: string;
}

export function MetricCard({
  title,
  value,
  unit,
  subtext,
  icon: Icon,
  iconColor = "text-[#E5B25D]",
  badge,
  className = "",
}: MetricCardProps) {
  return (
    <div
      className={`relative p-4 sm:p-5 rounded-2xl border border-border bg-card flex flex-col justify-between space-y-3 transition-all hover:border-strong-border shadow-xs ${className}`}
    >
      {/* Card Header: Title & Circular Icon */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-normal text-muted-foreground uppercase tracking-[0.12em]">
          {title}
        </span>
        <div className={`w-7 h-7 rounded-full bg-secondary/80 border border-border/80 flex items-center justify-center ${iconColor}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Main Metric Value */}
      <div className="space-y-1">
        <div className="flex items-baseline gap-1 font-mono">
          <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground tabular-nums">
            {value}
          </span>
          {unit && (
            <span className="text-xs font-normal text-muted-foreground">
              {unit}
            </span>
          )}
        </div>

        {/* Subtext / Context */}
        {subtext && (
          <div className="text-[11px] text-muted-foreground font-mono flex items-center gap-1.5 pt-0.5">
            {subtext}
          </div>
        )}
      </div>

      {/* Optional Badge Indicator */}
      {badge && (
        <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs">
          {badge}
        </div>
      )}
    </div>
  );
}
