"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
  CartesianGrid,
} from "recharts";
import { useScenario } from "@/context/ScenarioContext";
import { BatteryCharging, ShieldCheck, Zap } from "lucide-react";

interface BatterySoCChartProps {
  className?: string;
}

export function BatterySoCChart({ className = "" }: BatterySoCChartProps) {
  const { activeRequest, activeResponse, highlightedHours } = useScenario();

  if (!activeResponse) return null;

  const { battery } = activeRequest;
  const { hourly_plan, directive_interpretation } = activeResponse;

  const chartData = hourly_plan.map((entry) => {
    return {
      hour: entry.hour,
      hourLabel: `${entry.hour.toString().padStart(2, "0")}:00`,
      energy_kwh: entry.battery_energy_after_kwh,
      action: entry.battery_action,
      action_kwh: entry.battery_kwh,
      soc_percent: Math.round((entry.battery_energy_after_kwh / battery.capacity_kwh) * 100),
    };
  });

  const finalEnergy =
    chartData.length > 0 ? chartData[chartData.length - 1].energy_kwh : battery.initial_energy_kwh;
  const isNeutral = Math.abs(finalEnergy - battery.initial_energy_kwh) < 0.05;

  // Find active directive windows affecting battery
  const reserveDirectives = directive_interpretation.filter(
    (d) =>
      d.applies &&
      (d.directive_type === "minimum_battery_reserve" ||
        d.directive_type === "no_charge_window" ||
        d.directive_type === "no_discharge_window")
  );

  return (
    <div
      className={`rounded-xl border border-border bg-card/70 p-4 md:p-5 space-y-3 font-mono ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-sky-500/10 text-sky-400">
            <BatteryCharging className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Battery State of Charge (SoC) & Energy Trajectory
            </h4>
            <p className="text-[11px] text-muted-foreground">
              Capacity: {battery.capacity_kwh} kWh &bull; Min Reserve: {battery.minimum_energy_kwh} kWh &bull; Initial: {battery.initial_energy_kwh} kWh
            </p>
          </div>
        </div>

        {/* End-of-Day Neutrality Badge */}
        <div className="flex items-center gap-1.5 text-xs">
          {isNeutral ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-semibold text-[11px]">
              <ShieldCheck className="w-3 h-3" />
              <span>E23 = E0 Neutrality Preserved</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 font-semibold text-[11px]">
              <span>E23 ({finalEnergy} kWh) ≠ E0 ({battery.initial_energy_kwh} kWh)</span>
            </span>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="h-44 md:h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            syncId="gridwise-dispatch"
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="batterySocGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
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
              fontSize={10}
              interval={1}
            />

            <YAxis
              domain={[0, Math.ceil(battery.capacity_kwh * 1.05)]}
              tickLine={false}
              stroke="#64748b"
              fontSize={10}
              unit="k"
            />

            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const data = payload[0].payload;
                return (
                  <div className="p-2.5 rounded-lg border border-border bg-popover text-popover-foreground text-xs shadow-md space-y-1 font-mono">
                    <div className="font-bold text-foreground border-b border-border/40 pb-1">
                      Hour: {data.hourLabel}
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Stored Energy:</span>
                      <span className="font-bold text-sky-400">
                        {data.energy_kwh.toFixed(2)} kWh ({data.soc_percent}%)
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Action:</span>
                      <span className="capitalize font-semibold text-foreground">
                        {data.action} ({data.action_kwh.toFixed(2)} kWh)
                      </span>
                    </div>
                  </div>
                );
              }}
            />

            {/* Directive Window Overlays */}
            {reserveDirectives.map((dir, idx) => {
              const hours = dir.structured_adjustment?.hours || [];
              if (hours.length === 0) return null;
              const startLabel = `${hours[0].toString().padStart(2, "0")}:00`;
              const endLabel = `${hours[hours.length - 1].toString().padStart(2, "0")}:00`;
              const color =
                dir.directive_type === "no_charge_window"
                  ? "rgba(167, 139, 250, 0.12)"
                  : dir.directive_type === "no_discharge_window"
                  ? "rgba(251, 113, 133, 0.12)"
                  : "rgba(56, 189, 248, 0.12)";

              return (
                <ReferenceArea
                  key={idx}
                  x1={startLabel}
                  x2={endLabel}
                  fill={color}
                  fillOpacity={1}
                />
              );
            })}

            {/* Interactive Brushing from Table / Card hover */}
            {highlightedHours && highlightedHours.length > 0 && (
              <ReferenceArea
                x1={`${highlightedHours[0].toString().padStart(2, "0")}:00`}
                x2={`${highlightedHours[highlightedHours.length - 1].toString().padStart(2, "0")}:00`}
                fill="rgba(16, 185, 129, 0.2)"
              />
            )}

            {/* Reference Line: Capacity */}
            <ReferenceLine
              y={battery.capacity_kwh}
              stroke="#64748b"
              strokeDasharray="4 4"
              label={{
                value: `Max Cap: ${battery.capacity_kwh}k`,
                position: "insideTopRight",
                fill: "#64748b",
                fontSize: 9,
              }}
            />

            {/* Reference Line: Minimum Reserve */}
            <ReferenceLine
              y={battery.minimum_energy_kwh}
              stroke="#ef4444"
              strokeDasharray="3 3"
              label={{
                value: `Min: ${battery.minimum_energy_kwh}k`,
                position: "insideBottomRight",
                fill: "#ef4444",
                fontSize: 9,
              }}
            />

            {/* Reference Line: Initial Energy (E0) */}
            <ReferenceLine
              y={battery.initial_energy_kwh}
              stroke="#06b6d4"
              strokeDasharray="2 2"
              label={{
                value: `E0: ${battery.initial_energy_kwh}k`,
                position: "insideTopLeft",
                fill: "#06b6d4",
                fontSize: 9,
              }}
            />

            <Area
              type="monotone"
              dataKey="energy_kwh"
              stroke="#06b6d4"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#batterySocGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
