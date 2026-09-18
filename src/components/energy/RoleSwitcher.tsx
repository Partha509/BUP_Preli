"use client";

import React from "react";
import { useRole } from "@/hooks/useRole";
import { SlidersHorizontal, BarChart3 } from "lucide-react";

export function RoleSwitcher({ className = "" }: { className?: string }) {
  const { role, setRole } = useRole();

  return (
    <div
      className={`inline-flex items-center p-0.5 rounded-full border border-border bg-secondary/60 text-[10px] font-mono select-none ${className}`}
      role="group"
      aria-label="Select User Role"
    >
      <button
        type="button"
        onClick={() => setRole("operator")}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full uppercase tracking-wider transition-all cursor-pointer ${
          role === "operator"
            ? "bg-[#1B241F] text-[#E5B25D] border border-[#3A4B40] font-normal shadow-xs"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-pressed={role === "operator"}
      >
        <SlidersHorizontal className="w-3 h-3 text-[#E5B25D]" />
        <span>Operator</span>
      </button>

      <button
        type="button"
        onClick={() => setRole("analyst")}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full uppercase tracking-wider transition-all cursor-pointer ${
          role === "analyst"
            ? "bg-[#1B241F] text-[#E5B25D] border border-[#3A4B40] font-normal shadow-xs"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-pressed={role === "analyst"}
      >
        <BarChart3 className="w-3 h-3 text-[#E5B25D]" />
        <span>Analyst</span>
      </button>
    </div>
  );
}
