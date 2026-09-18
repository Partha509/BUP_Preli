"use client";

import React, { useState } from "react";
import { useScenario } from "@/context/ScenarioContext";
import { BatteryActionBadge } from "./BatteryActionBadge";
import { TableExportButton } from "./TableExportButton";
import { ScheduleTableSkeleton } from "@/components/ui/LoadingSkeletons";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Calendar,
  CheckCircle2,
  Filter,
  Layers,
  AlertTriangle,
  Scale,
} from "lucide-react";

interface HourlyScheduleTableProps {
  className?: string;
}

export function HourlyScheduleTable({ className = "" }: HourlyScheduleTableProps) {
  const {
    activeRequest,
    activeResponse,
    isLoading,
    highlightedHours,
    setHighlightedHours,
  } = useScenario();

  const [filterDirectiveHoursOnly, setFilterDirectiveHoursOnly] = useState(false);

  if (isLoading) {
    return <ScheduleTableSkeleton />;
  }

  if (!activeResponse) {
    return (
      <div
        className={`rounded-xl border border-dashed border-border bg-card/40 p-8 text-center space-y-3 ${className}`}
      >
        <div className="p-3 rounded-full bg-secondary border border-border w-fit mx-auto text-muted-foreground">
          <Calendar className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-sm text-foreground">
            No 24-Hour Dispatch Plan Generated
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Click &quot;Optimize Energy&quot; to inspect the complete 24-hour balance schedule, hourly grid draw, and battery state.
          </p>
        </div>
      </div>
    );
  }

  const { hourly_plan, total_grid_kwh, total_cost_bdt, peak_grid_kwh, directive_interpretation } =
    activeResponse;

  // Extract all hours affected by applicable directives
  const allDirectiveHours = new Set<number>();
  directive_interpretation
    .filter((d) => d.applies && d.structured_adjustment?.hours)
    .forEach((d) => {
      d.structured_adjustment?.hours?.forEach((h) => allDirectiveHours.add(h));
    });

  // Calculate max tariff for price intensity color coding
  const maxTariff = Math.max(
    ...activeRequest.hours.map((h) => h.tariff_bdt_per_kwh),
    1
  );

  // Filter rows if toggle is active
  const displayedRows = hourly_plan.filter((entry) => {
    if (!filterDirectiveHoursOnly) return true;
    return allDirectiveHours.has(entry.hour);
  });

  return (
    <div
      id="demo-section-schedule"
      className={`rounded-xl border border-border bg-card p-4 md:p-6 space-y-4 font-mono transition-all duration-300 ${className}`}
    >
      {/* Table Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm text-foreground">
              24-Hour Dispatch Schedule & Balance Validation
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Exact hourly breakdown &bull; Grid + SolarUsed + BatDis = Demand + BatChg (&plusmn;0.01 kWh tolerance)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Directive Hours Filter Toggle */}
          <button
            type="button"
            onClick={() => setFilterDirectiveHoursOnly(!filterDirectiveHoursOnly)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-mono transition-colors ${
              filterDirectiveHoursOnly
                ? "border-primary bg-primary/10 text-primary font-semibold"
                : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Directive Hours ({allDirectiveHours.size})</span>
          </button>

          {/* Export CSV / JSON Buttons */}
          <TableExportButton />
        </div>
      </div>

      {/* Table Container with Horizontal Scroll & Sticky First Column */}
      <div className="overflow-x-auto rounded-lg border border-border/70">
        <Table className="w-full text-xs">
          <TableHeader className="bg-secondary/40">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-20 sticky left-0 bg-secondary z-10 font-bold">
                Hour
              </TableHead>
              <TableHead className="text-right">Tariff (BDT)</TableHead>
              <TableHead className="text-right">Demand (kWh)</TableHead>
              <TableHead className="text-right text-amber-500">Solar Used</TableHead>
              <TableHead className="text-center">Battery Action</TableHead>
              <TableHead className="text-right text-sky-400">Battery After</TableHead>
              <TableHead className="text-right text-indigo-400">Grid (kWh)</TableHead>
              <TableHead className="text-right">Cost (BDT)</TableHead>
              <TableHead className="text-center w-28">Energy Balance</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {displayedRows.map((entry) => {
              const reqHour = activeRequest.hours.find((h) => h.hour === entry.hour);
              const demand = reqHour?.demand_kwh ?? 0;
              const tariff = reqHour?.tariff_bdt_per_kwh ?? 0;
              const cost = Number((entry.grid_kwh * tariff).toFixed(2));

              // Balance Validation Equation:
              // Left: Energy Supplied = Grid + SolarUsed + (Discharge ? BatKwh : 0)
              // Right: Energy Consumed = Demand + (Charge ? BatKwh : 0)
              const supply =
                entry.grid_kwh +
                entry.solar_used_kwh +
                (entry.battery_action === "discharge" ? entry.battery_kwh : 0);
              const consumption =
                demand + (entry.battery_action === "charge" ? entry.battery_kwh : 0);
              const balanceDelta = Math.abs(supply - consumption);
              const isBalanced = balanceDelta <= 0.01;

              const isHighlighted =
                highlightedHours && highlightedHours.includes(entry.hour);
              const isPeakHour = entry.grid_kwh === peak_grid_kwh && peak_grid_kwh > 0;
              const isHighTariff = tariff >= maxTariff * 0.85;

              return (
                <TableRow
                  key={entry.hour}
                  onMouseEnter={() => setHighlightedHours([entry.hour])}
                  onMouseLeave={() => setHighlightedHours(null)}
                  className={`transition-colors duration-100 ${
                    isHighlighted
                      ? "bg-primary/10 border-l-2 border-l-primary"
                      : isPeakHour
                      ? "bg-amber-500/5"
                      : "hover:bg-secondary/30"
                  }`}
                >
                  {/* Column 1: Hour (Sticky) */}
                  <TableCell
                    className={`font-bold sticky left-0 z-10 ${
                      isHighlighted ? "bg-primary/20 text-primary" : "bg-card text-foreground"
                    }`}
                  >
                    {entry.hour.toString().padStart(2, "0")}:00
                  </TableCell>

                  {/* Column 2: Tariff with intensity color */}
                  <TableCell
                    className={`text-right font-semibold ${
                      isHighTariff ? "text-purple-400" : "text-muted-foreground"
                    }`}
                  >
                    ৳{tariff.toFixed(2)}
                  </TableCell>

                  {/* Column 3: Demand */}
                  <TableCell className="text-right text-foreground/90">
                    {demand.toFixed(2)}
                  </TableCell>

                  {/* Column 4: Solar Used */}
                  <TableCell className="text-right text-amber-500 font-medium">
                    {entry.solar_used_kwh.toFixed(2)}
                  </TableCell>

                  {/* Column 5: Battery Action */}
                  <TableCell className="text-center">
                    <BatteryActionBadge
                      action={entry.battery_action}
                      kwh={entry.battery_kwh}
                    />
                  </TableCell>

                  {/* Column 6: Battery Storage After */}
                  <TableCell className="text-right text-sky-400 font-medium">
                    {entry.battery_energy_after_kwh.toFixed(2)}
                  </TableCell>

                  {/* Column 7: Grid Purchase */}
                  <TableCell
                    className={`text-right font-bold ${
                      isPeakHour ? "text-amber-500" : "text-indigo-400"
                    }`}
                  >
                    {entry.grid_kwh.toFixed(2)}
                    {isPeakHour && (
                      <span className="ml-1 text-[10px] text-amber-500">(PEAK)</span>
                    )}
                  </TableCell>

                  {/* Column 8: Hourly Cost */}
                  <TableCell className="text-right font-medium text-foreground">
                    ৳{cost.toFixed(2)}
                  </TableCell>

                  {/* Column 9: Energy Balance Check Pill */}
                  <TableCell className="text-center">
                    {isBalanced ? (
                      <span
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20"
                        title={`Supply: ${supply.toFixed(2)} = Demand+Charge: ${consumption.toFixed(2)}`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Valid</span>
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-destructive bg-destructive/10 px-2 py-0.5 rounded border border-destructive/20"
                        title={`Delta: ${balanceDelta.toFixed(3)} kWh exceeds 0.01 kWh threshold`}
                      >
                        <AlertTriangle className="w-3 h-3" />
                        <span>Δ {balanceDelta.toFixed(2)}</span>
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Summary Footer Row */}
      <div className="p-3 rounded-lg border border-border bg-secondary/30 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 text-muted-foreground">
          <span>
            Total Rows: <strong className="text-foreground">{displayedRows.length}</strong> / 24
          </span>
          <span>
            Peak Grid Import:{" "}
            <strong className="text-amber-500">{peak_grid_kwh.toFixed(2)} kWh</strong>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span>
            Total Grid: <strong className="text-indigo-400">{total_grid_kwh.toFixed(2)} kWh</strong>
          </span>
          <span>
            Total Cost: <strong className="text-emerald-500">৳{total_cost_bdt.toFixed(2)} BDT</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
