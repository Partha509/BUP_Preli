"use client";

import React from "react";
import { useRole, UserRole } from "@/hooks/useRole";
import { SlidersHorizontal, BarChart3 } from "lucide-react";

export function RoleSwitcher({ className = "" }: { className?: string }) {
  const { role, setRole } = useRole();

  return (
    <div
      className={`inline-flex items-center p-0.5 rounded-lg border border-border bg-secondary/60 text-xs font-medium ${className}`}
      role="group"
      aria-label="Select User Role"
    >
      <button
        type="button"
        onClick={() => setRole("operator")}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all duration-150 ${
          role === "operator"
            ? "bg-card text-foreground shadow-xs font-semibold border border-border/60"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-pressed={role === "operator"}
      >
        <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
        <span>Operator</span>
      </button>

      <button
        type="button"
        onClick={() => setRole("analyst")}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all duration-150 ${
          role === "analyst"
            ? "bg-card text-foreground shadow-xs font-semibold border border-border/60"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-pressed={role === "analyst"}
      >
        <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
        <span>Analyst</span>
      </button>
    </div>
  );
}
