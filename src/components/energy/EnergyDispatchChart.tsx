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
        className={`rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center space-y-3 ${className}`}
      >
        <div className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center mx-auto text-muted-foreground">
          <Activity className="w-5 h-5 text-[#E5B25D]" />
        </div>
        <h3 className="font-normal text-xs uppercase tracking-[0.12em] text-foreground">
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
    (d) => d.applies && d.structured_adjustment && d.structured_adjustment.hours?.length > 0
  );

  return (
    <div id="demo-section-chart" className={`space-y-4 transition-all duration-300 ${className}`}>
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 md:p-6 space-y-4 shadow-xs">
        {/* Header & Interactive Toggles */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-secondary/80 border border-border/80 flex items-center justify-center text-[#E5B25D]">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-normal text-[11px] text-foreground tracking-[0.12em] uppercase font-mono">
                24-Hour Dispatch & Tariff Arbitrage Telemetry
              </h3>
              <p className="text-[10px] text-muted-foreground font-mono">
                Synchronized Dual-Axis Dispatch &bull; Hover points to inspect hourly energy balance
              </p>
            </div>
          </div>

          <ChartLegendToggles visibility={visibility} onToggle={handleToggle} />
        </div>

        {/* Dispatch Composed Chart */}
        <div className="h-72 sm:h-80 md:h-96 w-full pt-2 font-mono">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              syncId="gridwise-dispatch"
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E5B25D" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#E5B25D" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="gridGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#94A3B8" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(148, 163, 184, 0.12)"
              />

              {/* X-Axis: 24 Hours */}
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
                stroke="#34d399"
                fontSize={11}
                unit="৳"
              />

              {/* Directive Window Overlays */}
              {applicableDirectives.map((dir, idx) => {
                const hours = dir.structured_adjustment?.hours || [];
                const startLabel = `${hours[0].toString().padStart(2, "0")}:00`;
                const endLabel = `${hours[hours.length - 1].toString().padStart(2, "0")}:00`;

                let fillColor = "rgba(148, 163, 184, 0.08)";
                if (dir.directive_type === "solar_limit") {
                  fillColor = "rgba(229, 178, 93, 0.12)";
                } else if (dir.directive_type === "battery_charge_limit") {
                  fillColor = "rgba(167, 139, 250, 0.12)";
                } else if (dir.directive_type === "battery_discharge_limit") {
                  fillColor = "rgba(251, 113, 133, 0.12)";
                } else if (dir.directive_type === "grid_import_limit") {
                  fillColor = "rgba(148, 163, 184, 0.12)";
                } else if (dir.directive_type === "battery_soc_target") {
                  fillColor = "rgba(45, 212, 191, 0.12)";
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
                  fill="rgba(229, 178, 93, 0.2)"
                />
              )}

              {/* Custom Tooltip */}
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const data = payload[0].payload;

                  return (
                    <div className="p-3 rounded-xl border border-border bg-card text-foreground text-xs shadow-xl space-y-2 font-mono min-w-[220px]">
                      <div className="flex items-center justify-between border-b border-border/40 pb-1.5 font-medium">
                        <span className="text-foreground">Hour: {data.hourLabel}</span>
                        <span className="text-emerald-400 font-semibold">
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
                          <span className="text-[#E5B25D]">Solar Used:</span>
                          <span className="font-bold text-[#E5B25D]">
                            {data.solar_used_kwh.toFixed(2)} kWh
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-slate-400">Grid Purchase:</span>
                          <span className="font-bold text-slate-300">
                            {data.grid_kwh.toFixed(2)} kWh
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-teal-400">Battery Action:</span>
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

              {/* Series 1: Solar Used (Navbar Gold Area) */}
              {visibility.solar && (
                <Area
                  yAxisId="energy"
                  type="monotone"
                  dataKey="solar_used_kwh"
                  stroke="#E5B25D"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#solarGrad)"
                  name="Solar Used"
                />
              )}

              {/* Series 2: Grid Purchase (Slate Area) */}
              {visibility.grid && (
                <Area
                  yAxisId="energy"
                  type="monotone"
                  dataKey="grid_kwh"
                  stroke="#94A3B8"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#gridGrad)"
                  name="Grid Purchase"
                />
              )}

              {/* Series 3: Battery Discharge (Teal Bar) */}
              {visibility.batteryDischarge && (
                <Bar
                  yAxisId="energy"
                  dataKey="battery_discharge_kwh"
                  fill="#2DD4BF"
                  radius={[3, 3, 0, 0]}
                  name="Battery Discharge"
                />
              )}

              {/* Series 4: Battery Charge (Cyan Bar) */}
              {visibility.batteryCharge && (
                <Bar
                  yAxisId="energy"
                  dataKey="battery_charge_kwh"
                  fill="#0EA5E9"
                  radius={[3, 3, 0, 0]}
                  name="Battery Charge"
                />
              )}

              {/* Series 5: Campus Demand (Coral Dashed Line) */}
              {visibility.demand && (
                <Line
                  yAxisId="energy"
                  type="monotone"
                  dataKey="demand_kwh"
                  stroke="#FB7185"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                  name="Campus Demand"
                />
              )}

              {/* Series 6: Electricity Tariff (Emerald Stepped Line) */}
              {visibility.tariff && (
                <Line
                  yAxisId="tariff"
                  type="stepAfter"
                  dataKey="tariff_bdt"
                  stroke="#34D399"
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
