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
  iconColor = "text-primary",
  badge,
  className = "",
}: MetricCardProps) {
  return (
    <div
      className={`relative p-4 md:p-5 rounded-xl border border-border bg-card/70 backdrop-blur-xs flex flex-col justify-between space-y-3 transition-all duration-200 hover:border-border/90 hover:shadow-xs ${className}`}
    >
      {/* Card Header: Title & Icon */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </span>
        <div className={`p-2 rounded-lg bg-secondary/80 border border-border/40 ${iconColor}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {/* Main Metric Value */}
      <div className="space-y-1">
        <div className="flex items-baseline gap-1.5 font-mono">
          <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            {value}
          </span>
          {unit && (
            <span className="text-xs font-semibold text-muted-foreground">
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
