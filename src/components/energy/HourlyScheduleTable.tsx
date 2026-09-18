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
        className={`rounded-2xl border border-dashed border-border bg-card/40 p-8 text-center space-y-3 ${className}`}
      >
        <div className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center mx-auto text-muted-foreground">
          <Calendar className="w-5 h-5 text-[#E5B25D]" />
        </div>
        <div className="space-y-1">
          <h3 className="font-normal text-xs uppercase tracking-[0.12em] text-foreground">
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
      className={`rounded-2xl border border-border bg-card p-4 sm:p-5 md:p-6 space-y-4 font-mono shadow-xs transition-all duration-300 ${className}`}
    >
      {/* Table Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-secondary/80 border border-border/80 flex items-center justify-center text-[#E5B25D]">
              <Scale className="w-3.5 h-3.5" />
            </div>
            <h3 className="font-normal text-[11px] text-foreground tracking-[0.12em] uppercase font-mono">
              24-Hour Dispatch Schedule & Balance Validation
            </h3>
          </div>
          <p className="text-[10px] text-muted-foreground font-mono">
            Exact hourly breakdown &bull; Grid + SolarUsed + BatDis = Demand + BatChg (&plusmn;0.01 kWh tolerance)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Directive Hours Filter Toggle */}
          <button
            type="button"
            onClick={() => setFilterDirectiveHoursOnly(!filterDirectiveHoursOnly)}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-mono tracking-wider uppercase transition-colors cursor-pointer select-none ${
              filterDirectiveHoursOnly
                ? "border-[#3A4B40] bg-[#1B241F] text-[#E5B25D]"
                : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Filter className="w-3 h-3" />
            <span>Directive Hours ({allDirectiveHours.size})</span>
          </button>

          {/* Export CSV / JSON Buttons */}
          <TableExportButton />
        </div>
      </div>

      {/* Table Container with Horizontal Scroll & Sticky First Column */}
      <div className="overflow-x-auto rounded-xl border border-border/70 bg-card">
        <Table className="w-full text-xs">
          <TableHeader className="bg-secondary/60">
            <TableRow className="hover:bg-transparent border-b border-border/80">
              <TableHead className="w-20 sticky left-0 bg-secondary/90 z-10 font-semibold text-[11px] tracking-wider uppercase text-foreground">
                Hour
              </TableHead>
              <TableHead className="text-right text-[11px] tracking-wider uppercase">Tariff (BDT)</TableHead>
              <TableHead className="text-right text-[11px] tracking-wider uppercase">Demand (kWh)</TableHead>
              <TableHead className="text-right text-[11px] tracking-wider uppercase text-[#E5B25D]">Solar Used</TableHead>
              <TableHead className="text-center text-[11px] tracking-wider uppercase">Battery Action</TableHead>
              <TableHead className="text-right text-[11px] tracking-wider uppercase text-teal-400">Battery After</TableHead>
              <TableHead className="text-right text-[11px] tracking-wider uppercase text-slate-300">Grid (kWh)</TableHead>
              <TableHead className="text-right text-[11px] tracking-wider uppercase">Cost (BDT)</TableHead>
              <TableHead className="text-center w-28 text-[11px] tracking-wider uppercase">Balance</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {displayedRows.map((entry) => {
              const reqHour = activeRequest.hours.find((h) => h.hour === entry.hour);
              const demand = reqHour?.demand_kwh ?? 0;
              const tariff = reqHour?.tariff_bdt_per_kwh ?? 0;
              const cost = Number((entry.grid_kwh * tariff).toFixed(2));

              // Balance Validation Equation:
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
                      ? "bg-[#1B241F] text-foreground border-l-2 border-l-[#E5B25D]"
                      : isPeakHour
                      ? "bg-[#E5B25D]/5"
                      : "hover:bg-secondary/30"
                  }`}
                >
                  {/* Column 1: Hour (Sticky) */}
                  <TableCell
                    className={`font-semibold sticky left-0 z-10 ${
                      isHighlighted ? "bg-[#1B241F] text-[#E5B25D]" : "bg-card text-foreground"
                    }`}
                  >
                    {entry.hour.toString().padStart(2, "0")}:00
                  </TableCell>

                  {/* Column 2: Tariff */}
                  <TableCell
                    className={`text-right ${
                      isHighTariff ? "text-emerald-400 font-medium" : "text-muted-foreground"
                    }`}
                  >
                    ৳{tariff.toFixed(2)}
                  </TableCell>

                  {/* Column 3: Demand */}
                  <TableCell className="text-right text-foreground/90">
                    {demand.toFixed(2)}
                  </TableCell>

                  {/* Column 4: Solar Used */}
                  <TableCell className="text-right font-medium text-[#E5B25D]">
                    {entry.solar_used_kwh > 0 ? entry.solar_used_kwh.toFixed(2) : "0.00"}
                  </TableCell>

                  {/* Column 5: Battery Action Badge */}
                  <TableCell className="text-center">
                    <BatteryActionBadge
                      action={entry.battery_action}
                      amountKwh={entry.battery_kwh}
                    />
                  </TableCell>

                  {/* Column 6: Battery After */}
                  <TableCell className="text-right font-medium text-teal-400">
                    {entry.battery_energy_after_kwh.toFixed(2)}
                  </TableCell>

                  {/* Column 7: Grid Purchase */}
                  <TableCell
                    className={`text-right font-semibold ${
                      isPeakHour ? "text-[#E5B25D]" : "text-foreground"
                    }`}
                  >
                    {entry.grid_kwh.toFixed(2)}
                  </TableCell>

                  {/* Column 8: Cost BDT */}
                  <TableCell className="text-right text-foreground font-semibold">
                    ৳{cost.toFixed(2)}
                  </TableCell>

                  {/* Column 9: Energy Balance Check */}
                  <TableCell className="text-center">
                    {isBalanced ? (
                      <span
                        className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30"
                        title={`Supply: ${supply.toFixed(2)} = Consumption: ${consumption.toFixed(2)}`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>0.00</span>
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1 text-[10px] text-rose-400 font-medium uppercase px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30"
                        title={`Delta: ${balanceDelta.toFixed(3)} kWh`}
                      >
                        <AlertTriangle className="w-3 h-3" />
                        <span>&Delta;{balanceDelta.toFixed(2)}</span>
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
