"use client";

import React, { useState } from "react";
import { useScenario } from "@/context/ScenarioContext";
import { FileText, FileJson, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TableExportButtonProps {
  className?: string;
}

export function TableExportButton({ className = "" }: TableExportButtonProps) {
  const { activeRequest, activeResponse } = useScenario();
  const [downloadedFormat, setDownloadedFormat] = useState<string | null>(null);

  if (!activeResponse) return null;

  const exportCSV = () => {
    const { hourly_plan, scenario_id } = activeResponse;

    const headers = [
      "hour",
      "hour_label",
      "tariff_bdt_per_kwh",
      "demand_kwh",
      "solar_used_kwh",
      "battery_action",
      "battery_kwh",
      "battery_energy_after_kwh",
      "grid_kwh",
      "hourly_cost_bdt",
    ];

    const rows = hourly_plan.map((entry) => {
      const reqHour = activeRequest.hours.find((h) => h.hour === entry.hour);
      const tariff = reqHour?.tariff_bdt_per_kwh ?? 0;
      const demand = reqHour?.demand_kwh ?? 0;
      const cost = Number((entry.grid_kwh * tariff).toFixed(2));

      return [
        entry.hour,
        `"${entry.hour.toString().padStart(2, "0")}:00"`,
        tariff,
        demand,
        entry.solar_used_kwh,
        entry.battery_action,
        entry.battery_kwh,
        entry.battery_energy_after_kwh,
        entry.grid_kwh,
        cost,
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `gridwise_schedule_${scenario_id || "GRID-101"}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadedFormat("CSV");
    setTimeout(() => setDownloadedFormat(null), 2000);
  };

  const exportJSON = () => {
    const { scenario_id } = activeResponse;
    const jsonContent = JSON.stringify(activeResponse, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `gridwise_schedule_${scenario_id || "GRID-101"}.json`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadedFormat("JSON");
    setTimeout(() => setDownloadedFormat(null), 2000);
  };

  return (
    <div className={`flex items-center gap-1.5 font-mono text-xs ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={exportCSV}
        className="h-8 gap-1 text-[11px] font-mono tracking-wider uppercase rounded-full border border-border/80 bg-secondary/40 px-3"
        title="Download schedule as CSV spreadsheet"
      >
        {downloadedFormat === "CSV" ? (
          <Check className="w-3 h-3 text-emerald-400" />
        ) : (
          <FileText className="w-3 h-3 text-muted-foreground" />
        )}
        <span>CSV</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={exportJSON}
        className="h-8 gap-1 text-[11px] font-mono tracking-wider uppercase rounded-full border border-border/80 bg-secondary/40 px-3"
        title="Download complete JSON API response"
      >
        {downloadedFormat === "JSON" ? (
          <Check className="w-3 h-3 text-emerald-400" />
        ) : (
          <FileJson className="w-3 h-3 text-muted-foreground" />
        )}
        <span>JSON</span>
      </Button>
    </div>
  );
}
