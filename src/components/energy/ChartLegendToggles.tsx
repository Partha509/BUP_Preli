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
      label: "Demand",
      color: "#FB7185",
      bgColor: "rgba(251, 113, 133, 0.12)",
      borderStyle: "dashed",
    },
    {
      key: "solar",
      label: "Solar",
      color: "#E5B25D",
      bgColor: "rgba(229, 178, 93, 0.12)",
    },
    {
      key: "grid",
      label: "Grid",
      color: "#94A3B8",
      bgColor: "rgba(148, 163, 184, 0.12)",
    },
    {
      key: "batteryDischarge",
      label: "Discharge",
      color: "#2DD4BF",
      bgColor: "rgba(45, 212, 191, 0.12)",
    },
    {
      key: "batteryCharge",
      label: "Charge",
      color: "#0EA5E9",
      bgColor: "rgba(14, 165, 233, 0.12)",
    },
    {
      key: "tariff",
      label: "Tariff",
      color: "#34D399",
      bgColor: "rgba(52, 211, 153, 0.12)",
    },
  ];

  return (
    <div className={`flex flex-wrap items-center gap-1.5 font-mono text-[10px] ${className}`}>
      {items.map((item) => {
        const isVisible = visibility[item.key];
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onToggle(item.key)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border transition-all uppercase tracking-wider select-none cursor-pointer ${
              isVisible
                ? "border-border shadow-2xs text-foreground bg-secondary/60"
                : "border-border/30 opacity-40 line-through text-muted-foreground bg-transparent"
            }`}
          >
            <span
              className="w-2 h-2 rounded-full inline-block shrink-0"
              style={{
                backgroundColor: item.color,
                border: item.borderStyle ? "1px dashed #ffffff" : "none",
              }}
            />
            <span>{item.label}</span>
            {isVisible ? (
              <Eye className="w-2.5 h-2.5 text-muted-foreground ml-0.5" />
            ) : (
              <EyeOff className="w-2.5 h-2.5 text-muted-foreground ml-0.5" />
            )}
          </button>
        );
      })}
    </div>
  );
}
