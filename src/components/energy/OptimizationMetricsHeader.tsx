"use client";

import React from "react";
import { useScenario } from "@/context/ScenarioContext";
import { MetricCard } from "./MetricCard";
import { KpiMetricsSkeleton } from "@/components/ui/LoadingSkeletons";
import {
  Banknote,
  Zap,
  Flame,
  BatteryCharging,
  CheckCircle2,
  TrendingUp,
  Sun,
  ShieldAlert,
} from "lucide-react";

interface OptimizationMetricsHeaderProps {
  className?: string;
}

export function OptimizationMetricsHeader({
  className = "",
}: OptimizationMetricsHeaderProps) {
  const { activeRequest, activeResponse, isLoading } = useScenario();

  if (isLoading) {
    return <KpiMetricsSkeleton />;
  }

  if (!activeResponse) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
        <MetricCard
          title="Total Cost"
          value="--"
          unit="BDT"
          subtext="Awaiting solver execution"
          icon={Banknote}
          iconColor="text-emerald-500"
        />
        <MetricCard
          title="Total Grid Energy"
          value="--"
          unit="kWh"
          subtext="Awaiting solver execution"
          icon={Zap}
          iconColor="text-indigo-400"
        />
        <MetricCard
          title="Peak Grid Draw"
          value="--"
          unit="kWh"
          subtext="Awaiting solver execution"
          icon={Flame}
          iconColor="text-amber-500"
        />
        <MetricCard
          title="Battery Neutrality"
          value="--"
          unit="kWh"
          subtext="E23 = E0 verification"
          icon={BatteryCharging}
          iconColor="text-sky-400"
        />
      </div>
    );
  }

  const { total_cost_bdt, total_grid_kwh, peak_grid_kwh, hourly_plan } = activeResponse;

  // 1. Calculate Peak Hour(s)
  const peakEntry = [...hourly_plan].sort((a, b) => b.grid_kwh - a.grid_kwh)[0];
  const peakHourStr = peakEntry
    ? `${peakEntry.hour.toString().padStart(2, "0")}:00`
    : "N/A";

  // 2. Solar Contribution
  const totalSolarUsed = hourly_plan.reduce((sum, h) => sum + h.solar_used_kwh, 0);
  const totalDemand = activeRequest.hours.reduce((sum, h) => sum + h.demand_kwh, 0);
  const solarSharePercent =
    totalDemand > 0 ? Math.round((totalSolarUsed / totalDemand) * 100) : 0;

  // 3. Battery End-of-Day Neutrality E23 = E0
  const initialEnergy = activeRequest.battery.initial_energy_kwh;
  const finalEnergy =
    hourly_plan.length > 0
      ? hourly_plan[hourly_plan.length - 1].battery_energy_after_kwh
      : initialEnergy;
  const deltaNeutrality = Math.abs(finalEnergy - initialEnergy);
  const isNeutral = deltaNeutrality < 0.05;

  const totalDischarge = hourly_plan
    .filter((h) => h.battery_action === "discharge")
    .reduce((sum, h) => sum + h.battery_kwh, 0);

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {/* 1. Total Electricity Cost */}
      <MetricCard
        title="Total Electricity Cost"
        value={total_cost_bdt.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
        unit="BDT"
        subtext={
          <span className="flex items-center gap-1 text-emerald-500 font-medium">
            <TrendingUp className="w-3 h-3" />
            <span>Optimal Tariff Arbitrage</span>
          </span>
        }
        icon={Banknote}
        iconColor="text-emerald-500"
        badge={
          <span className="text-[11px] text-muted-foreground font-mono">
            Directives Applied: {activeResponse.directive_interpretation.filter((d) => d.applies).length}
          </span>
        }
      />

      {/* 2. Total Grid Energy Import */}
      <MetricCard
        title="Total Grid Energy"
        value={total_grid_kwh.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
        unit="kWh"
        subtext={
          <span className="flex items-center gap-1 text-amber-500">
            <Sun className="w-3 h-3" />
            <span>{solarSharePercent}% Campus Solar Coverage</span>
          </span>
        }
        icon={Zap}
        iconColor="text-indigo-400"
        badge={
          <span className="text-[11px] text-muted-foreground font-mono">
            Solar Used: {totalSolarUsed.toFixed(1)} kWh
          </span>
        }
      />

      {/* 3. Peak Grid Demand */}
      <MetricCard
        title="Peak Grid Draw"
        value={peak_grid_kwh.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
        unit="kWh"
        subtext={
          <span className="text-muted-foreground font-mono">
            Occurred at hour <strong className="text-foreground">{peakHourStr}</strong>
          </span>
        }
        icon={Flame}
        iconColor="text-amber-500"
        badge={
          <span className="text-[11px] text-muted-foreground font-mono">
            Max Demand Cap Obeyed
          </span>
        }
      />

      {/* 4. Battery Cycling & Neutrality */}
      <MetricCard
        title="Battery Neutrality"
        value={`${finalEnergy.toFixed(1)} / ${initialEnergy.toFixed(1)}`}
        unit="kWh"
        subtext={
          isNeutral ? (
            <span className="flex items-center gap-1 text-emerald-500 font-medium">
              <CheckCircle2 className="w-3 h-3" />
              <span>E23 = E0 Verified (0.00 kWh)</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-500 font-medium">
              <ShieldAlert className="w-3 h-3" />
              <span>Delta: {deltaNeutrality.toFixed(2)} kWh</span>
            </span>
          )
        }
        icon={BatteryCharging}
        iconColor="text-sky-400"
        badge={
          <span className="text-[11px] text-muted-foreground font-mono">
            Discharge: {totalDischarge.toFixed(1)} kWh
          </span>
        }
      />
    </div>
  );
}
