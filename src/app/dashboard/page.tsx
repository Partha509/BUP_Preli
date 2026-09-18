"use client";

import React from "react";
import { AppShell } from "@/components/layout";
import { RoleAwareDashboard } from "@/components/energy";
import { DemoWalkthroughBar } from "@/components/demo";
import { useScenario } from "@/context/ScenarioContext";
import { Zap, ShieldCheck, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const { activeRequest, activeResponse, isLoading } = useScenario();

  return (
    <AppShell>
      <div className="space-y-6 pb-16">
        {/* 3-Minute Hackathon Demo Presentation Helper Bar */}
        <DemoWalkthroughBar />

        {/* Top Header Information */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
              <span className="font-semibold text-[#F3F5F4]">GridWise</span>
              <span className="font-light text-[#E5B25D] text-lg sm:text-xl">Operations Console</span>
            </h1>
            <p className="text-[11px] font-mono tracking-wider uppercase text-muted-foreground pt-0.5">
              Directive Interpretation &bull; Mathematical Cost Minimization &bull; 24h Schedule Solver
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" />
            <span className="uppercase tracking-wider">Scenario: <strong className="text-[#E5B25D]">{activeRequest.scenario_id}</strong></span>
          </div>
        </div>

        {/* Global Loading Spinner Notice */}
        {isLoading && (
          <div className="p-3.5 rounded-2xl border border-[#3A4B40] bg-[#1B241F] text-[#E5B25D] text-xs font-mono flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 animate-spin text-[#E5B25D]" />
            <span>Dispatching scenario payload to optimization solver (POST /optimize-energy)...</span>
          </div>
        )}

        {/* Role-Aware Console (Operator vs. Analyst) */}
        <RoleAwareDashboard />
      </div>
    </AppShell>
  );
}
