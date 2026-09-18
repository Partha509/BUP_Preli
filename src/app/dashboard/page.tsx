"use client";

import React from "react";
import { AppShell } from "@/components/layout";
import { RoleAwareDashboard } from "@/components/energy";
import { useScenario } from "@/context/ScenarioContext";
import { Zap, ShieldCheck, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const { activeRequest, activeResponse, isLoading } = useScenario();

  return (
    <AppShell>
      <div className="space-y-6 pb-16">
        {/* Top Header Information */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              <span>Campus Energy Operations Console</span>
            </h1>
            <p className="text-xs text-muted-foreground">
              Directives Interpretation &bull; Mathematical Cost Minimization &bull; 24h Schedule Solver
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
            <span>Active Scenario: <strong className="text-foreground">{activeRequest.scenario_id}</strong></span>
          </div>
        </div>

        {/* Global Loading Spinner Notice */}
        {isLoading && (
          <div className="p-4 rounded-lg border border-primary/40 bg-primary/10 text-primary text-xs font-mono flex items-center gap-2 animate-pulse">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Dispatching request to optimization backend (POST /optimize-energy)...</span>
          </div>
        )}

        {/* Role-Aware Console (Operator vs. Analyst) */}
        <RoleAwareDashboard />
      </div>
    </AppShell>
  );
}
