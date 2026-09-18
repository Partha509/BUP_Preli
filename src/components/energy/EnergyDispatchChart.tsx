"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceArea,
} from "recharts";
import { useScenario } from "@/context/ScenarioContext";
import { ChartLegendToggles, SeriesVisibilityState } from "./ChartLegendToggles";
import { BatterySoCChart } from "./BatterySoCChart";
import { DispatchChartSkeleton } from "@/components/ui/LoadingSkeletons";
import { Activity, Zap, Layers } from "lucide-react";

interface EnergyDispatchChartProps {
  className?: string;
}

export function EnergyDispatchChart({ className = "" }: EnergyDispatchChartProps) {
  const { activeRequest, activeResponse, isLoading, highlightedHours } = useScenario();

  const [visibility, setVisibility] = useState<SeriesVisibilityState>({
    demand: true,
    solar: true,
    grid: true,
    batteryDischarge: true,
    batteryCharge: true,
    tariff: true,
  });

  const handleToggle = (series: keyof SeriesVisibilityState) => {
    setVisibility((prev) => ({ ...prev, [series]: !prev[series] }));
  };

  if (isLoading) {
    return <DispatchChartSkeleton />;
  }

  if (!activeResponse) {
    return (
      <div
        className={`rounded-xl border border-dashed border-border bg-card/40 p-10 text-center space-y-3 ${className}`}
      >
        <div className="p-3 rounded-full bg-secondary border border-border w-fit mx-auto text-muted-foreground">
          <Activity className="w-6 h-6" />
        </div>
        <h3 className="font-semibold text-sm text-foreground">
          Awaiting 24-Hour Schedule from Backend
        </h3>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          Execute optimization via POST /optimize-energy to generate and visualize the 24-hour energy balance, battery dispatch, and tariff arbitrage schedule.
        </p>
      </div>
    );
  }

  const { hourly_plan, directive_interpretation } = activeResponse;

  // Merge hourly request data (demand & tariff) with hourly plan output
  const chartData = hourly_plan.map((planEntry) => {
    const reqHour = activeRequest.hours.find((h) => h.hour === planEntry.hour);
    const demandKwh = reqHour ? reqHour.demand_kwh : 0;
    const tariffBdt = reqHour ? reqHour.tariff_bdt_per_kwh : 0;

    return {
      hour: planEntry.hour,
      hourLabel: `${planEntry.hour.toString().padStart(2, "0")}:00`,
      demand_kwh: demandKwh,
      solar_used_kwh: planEntry.solar_used_kwh,
      grid_kwh: planEntry.grid_kwh,
      battery_discharge_kwh:
        planEntry.battery_action === "discharge" ? planEntry.battery_kwh : 0,
      battery_charge_kwh:
        planEntry.battery_action === "charge" ? planEntry.battery_kwh : 0,
      battery_action: planEntry.battery_action,
      battery_kwh: planEntry.battery_kwh,
      battery_energy_after_kwh: planEntry.battery_energy_after_kwh,
      tariff_bdt: tariffBdt,
    };
  });

  // Calculate max values for dynamic axis scaling
  const maxEnergy = Math.max(
    ...chartData.map(
      (d) =>
        Math.max(d.demand_kwh, d.solar_used_kwh, d.grid_kwh, d.battery_discharge_kwh) + 20
    ),
    100
  );

  const maxTariff = Math.max(...chartData.map((d) => d.tariff_bdt), 15);

  // Extract active directive windows for background shading
  const applicableDirectives = directive_interpretation.filter(
    (d) => d.applies && d.structured_adjustment?.hours?.length
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Primary Dispatch Chart Card */}
      <div className="rounded-xl border border-border bg-card p-4 md:p-6 space-y-4">
        {/* Top Control Bar: Title & Series Toggles */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-border pb-4">
          <div className="space-y-1">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span>24-Hour Energy Dispatch Schedule</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Hourly Power Balance &bull; Left Axis: Energy (kWh) &bull; Right Axis: Tariff (BDT/kWh)
            </p>
          </div>

          <ChartLegendToggles visibility={visibility} onToggle={handleToggle} />
        </div>

        {/* Recharts Composed Dual-Axis Timeline */}
        <div className="h-72 md:h-84 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              syncId="gridwise-dispatch"
              margin={{ top: 15, right: 10, left: -10, bottom: 5 }}
            >
              <defs>
                <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="gridGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(148, 163, 184, 0.15)"
              />

              <XAxis
                dataKey="hourLabel"
                tickLine={false}
                stroke="#64748b"
                fontSize={11}
                interval={1}
              />

              {/* Left Y-Axis: Energy (kWh) */}
              <YAxis
                yAxisId="energy"
                domain={[0, Math.ceil(maxEnergy / 20) * 20]}
                tickLine={false}
                stroke="#64748b"
                fontSize={11}
                unit="k"
              />

              {/* Right Y-Axis: Tariff (BDT/kWh) */}
              <YAxis
                yAxisId="tariff"
                orientation="right"
                domain={[0, Math.ceil(maxTariff + 2)]}
                tickLine={false}
                stroke="#a855f7"
                fontSize={11}
                unit="৳"
              />

              {/* Directive Window Overlays */}
              {applicableDirectives.map((dir, idx) => {
                const hours = dir.structured_adjustment?.hours || [];
                const startLabel = `${hours[0].toString().padStart(2, "0")}:00`;
                const endLabel = `${hours[hours.length - 1].toString().padStart(2, "0")}:00`;

                let fillColor = "rgba(148, 163, 184, 0.08)";
                if (dir.directive_type === "solar_reduction") {
                  fillColor = "rgba(245, 158, 11, 0.12)";
                } else if (dir.directive_type === "no_charge_window") {
                  fillColor = "rgba(167, 139, 250, 0.12)";
                } else if (dir.directive_type === "no_discharge_window") {
                  fillColor = "rgba(251, 113, 133, 0.12)";
                } else if (dir.directive_type === "max_grid_window") {
                  fillColor = "rgba(129, 140, 248, 0.12)";
                } else if (dir.directive_type === "minimum_battery_reserve") {
                  fillColor = "rgba(56, 189, 248, 0.12)";
                }

                return (
                  <ReferenceArea
                    key={idx}
                    yAxisId="energy"
                    x1={startLabel}
                    x2={endLabel}
                    fill={fillColor}
                    fillOpacity={1}
                  />
                );
              })}

              {/* Interactive Brushing from Table / Card hover */}
              {highlightedHours && highlightedHours.length > 0 && (
                <ReferenceArea
                  yAxisId="energy"
                  x1={`${highlightedHours[0].toString().padStart(2, "0")}:00`}
                  x2={`${highlightedHours[highlightedHours.length - 1].toString().padStart(2, "0")}:00`}
                  fill="rgba(16, 185, 129, 0.25)"
                />
              )}

              {/* Custom Tooltip strictly displaying all 7 required points */}
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const data = payload[0].payload;

                  return (
                    <div className="p-3 rounded-lg border border-border bg-popover text-popover-foreground text-xs shadow-lg space-y-2 font-mono min-w-[220px]">
                      <div className="flex items-center justify-between border-b border-border/40 pb-1.5 font-bold">
                        <span className="text-foreground">Hour: {data.hourLabel}</span>
                        <span className="text-purple-400 font-semibold">
                          Tariff: {data.tariff_bdt} BDT
                        </span>
                      </div>

                      <div className="space-y-1 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Demand:</span>
                          <span className="font-bold text-foreground">
                            {data.demand_kwh.toFixed(2)} kWh
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-amber-500">Solar Used:</span>
                          <span className="font-bold text-amber-500">
                            {data.solar_used_kwh.toFixed(2)} kWh
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-indigo-400">Grid Purchase:</span>
                          <span className="font-bold text-indigo-400">
                            {data.grid_kwh.toFixed(2)} kWh
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-emerald-500">Battery Action:</span>
                          <span className="font-bold capitalize text-foreground">
                            {data.battery_action} ({data.battery_kwh.toFixed(2)} kWh)
                          </span>
                        </div>

                        <div className="flex justify-between border-t border-border/40 pt-1">
                          <span className="text-sky-400">Battery After:</span>
                          <span className="font-bold text-sky-400">
                            {data.battery_energy_after_kwh.toFixed(2)} kWh
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />

              {/* Series 1: Solar Used (Amber Area) */}
              {visibility.solar && (
                <Area
                  yAxisId="energy"
                  type="monotone"
                  dataKey="solar_used_kwh"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#solarGrad)"
                  name="Solar Used"
                />
              )}

              {/* Series 2: Grid Purchase (Indigo Area/Bar) */}
              {visibility.grid && (
                <Area
                  yAxisId="energy"
                  type="monotone"
                  dataKey="grid_kwh"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#gridGrad)"
                  name="Grid Purchase"
                />
              )}

              {/* Series 3: Battery Discharge (Emerald Bar) */}
              {visibility.batteryDischarge && (
                <Bar
                  yAxisId="energy"
                  dataKey="battery_discharge_kwh"
                  fill="#10b981"
                  radius={[3, 3, 0, 0]}
                  name="Battery Discharge"
                />
              )}

              {/* Series 4: Battery Charge (Cyan Bar) */}
              {visibility.batteryCharge && (
                <Bar
                  yAxisId="energy"
                  dataKey="battery_charge_kwh"
                  fill="#06b6d4"
                  radius={[3, 3, 0, 0]}
                  name="Battery Charge"
                />
              )}

              {/* Series 5: Campus Demand (Slate Dashed Line) */}
              {visibility.demand && (
                <Line
                  yAxisId="energy"
                  type="monotone"
                  dataKey="demand_kwh"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                  name="Campus Demand"
                />
              )}

              {/* Series 6: Electricity Tariff (Purple Stepped Line) */}
              {visibility.tariff && (
                <Line
                  yAxisId="tariff"
                  type="stepAfter"
                  dataKey="tariff_bdt"
                  stroke="#a855f7"
                  strokeWidth={2}
                  dot={false}
                  name="Electricity Tariff"
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Synchronized Battery State of Charge (SoC) Sub-chart */}
      <BatterySoCChart />
    </div>
  );
}
