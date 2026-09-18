"use client";

import React from "react";
import { Eye, EyeOff } from "lucide-react";

export interface SeriesVisibilityState {
  demand: boolean;
  solar: boolean;
  grid: boolean;
  batteryDischarge: boolean;
  batteryCharge: boolean;
  tariff: boolean;
}

interface ChartLegendTogglesProps {
  visibility: SeriesVisibilityState;
  onToggle: (series: keyof SeriesVisibilityState) => void;
  className?: string;
}

export function ChartLegendToggles({
  visibility,
  onToggle,
  className = "",
}: ChartLegendTogglesProps) {
  const items: {
    key: keyof SeriesVisibilityState;
    label: string;
    color: string;
    bgColor: string;
    borderStyle?: string;
  }[] = [
    {
      key: "demand",
      label: "Campus Demand",
      color: "#94a3b8", // Slate 400
      bgColor: "rgba(148, 163, 184, 0.15)",
      borderStyle: "dashed",
    },
    {
      key: "solar",
      label: "Solar Used",
      color: "#f59e0b", // Amber 500
      bgColor: "rgba(245, 158, 11, 0.15)",
    },
    {
      key: "grid",
      label: "Grid Purchase",
      color: "#6366f1", // Indigo 500
      bgColor: "rgba(99, 102, 241, 0.15)",
    },
    {
      key: "batteryDischarge",
      label: "Battery Discharge",
      color: "#10b981", // Emerald 500
      bgColor: "rgba(16, 185, 129, 0.15)",
    },
    {
      key: "batteryCharge",
      label: "Battery Charge",
      color: "#06b6d4", // Cyan 500
      bgColor: "rgba(6, 182, 212, 0.15)",
    },
    {
      key: "tariff",
      label: "Tariff (BDT/kWh)",
      color: "#a855f7", // Purple 500
      bgColor: "rgba(168, 85, 247, 0.15)",
    },
  ];

  return (
    <div className={`flex flex-wrap items-center gap-1.5 font-mono text-[11px] ${className}`}>
      {items.map((item) => {
        const isVisible = visibility[item.key];
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onToggle(item.key)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-all ${
              isVisible
                ? "border-border shadow-2xs text-foreground"
                : "border-border/40 opacity-45 line-through text-muted-foreground"
            }`}
            style={{
              backgroundColor: isVisible ? item.bgColor : "transparent",
            }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
              style={{
                backgroundColor: item.color,
                border: item.borderStyle ? "1px dashed #ffffff" : "none",
              }}
            />
            <span>{item.label}</span>
            {isVisible ? (
              <Eye className="w-3 h-3 text-muted-foreground ml-0.5" />
            ) : (
              <EyeOff className="w-3 h-3 text-muted-foreground ml-0.5" />
            )}
          </button>
        );
      })}
    </div>
  );
}
