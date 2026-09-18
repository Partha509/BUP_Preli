import React from "react";
import { Terminal, ShieldAlert, Cpu, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ChallengeSpecsCard() {
  const supportedDirectives = [
    { name: "solar_reduction", desc: "Reduce usable solar during specific hours (factor 0..1)" },
    { name: "minimum_battery_reserve", desc: "Raise minimum battery reserve level (kWh)" },
    { name: "no_charge_window", desc: "Battery charge = 0 in listed hours" },
    { name: "no_discharge_window", desc: "Battery discharge = 0 in listed hours" },
    { name: "max_grid_window", desc: "Grid import capped at max_grid_kwh in listed hours" },
    { name: "no_op", desc: "Irrelevant note; applies = false, adjustment = null" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Col 1: Service Contract */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 font-medium text-xs tracking-wider uppercase text-foreground">
          <Terminal className="w-3.5 h-3.5 text-[#E5B25D]" />
          <h3>API Service Contract</h3>
        </div>
        <div className="space-y-2.5 font-mono text-xs">
          <div className="p-3 rounded-xl border border-border/80 bg-secondary/40 space-y-1">
            <div className="text-emerald-500 dark:text-emerald-400 font-bold text-xs tracking-wide">
              GET /health
            </div>
            <p className="text-muted-foreground text-[11px]">
              Returns HTTP 200 with {`{"status": "ok"}`} readiness probe.
            </p>
          </div>

          <div className="p-3 rounded-xl border border-border/80 bg-secondary/40 space-y-1">
            <div className="text-[#E5B25D] font-bold text-xs tracking-wide">
              POST /optimize-energy
            </div>
            <p className="text-muted-foreground text-[11px]">
              Accepts 24h scenario + 1–3 operator notes; returns validated schedule & cost.
            </p>
          </div>
        </div>

        <div className="text-[11px] text-muted-foreground pt-2 border-t border-border/40 font-mono">
          Timeout guard: <span className="text-[#E5B25D] font-semibold">30 seconds</span>
        </div>
      </div>

      {/* Col 2: Supported Directives List */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 font-medium text-xs tracking-wider uppercase text-foreground">
          <Layers className="w-3.5 h-3.5 text-[#E5B25D]" />
          <h3>Supported Directives (Section 04)</h3>
        </div>

        <div className="space-y-2 text-xs">
          {supportedDirectives.map((d) => (
            <div key={d.name} className="flex items-start gap-2">
              <Badge variant="outline" className="font-mono text-[10px] shrink-0 border-border/80">
                {d.name}
              </Badge>
              <span className="text-muted-foreground text-[11px] leading-snug pt-0.5">
                {d.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Col 3: Mathematical Constraints */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 font-medium text-xs tracking-wider uppercase text-foreground">
          <Cpu className="w-3.5 h-3.5 text-teal-400" />
          <h3>Canonical Optimization Rules</h3>
        </div>

        <div className="space-y-2.5 text-xs font-mono">
          <div className="p-3 rounded-xl border border-border/80 bg-secondary/40 space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-sans">
              Hourly Power Balance:
            </span>
            <div className="text-foreground text-[11px] font-medium leading-relaxed">
              Grid + SolarUsed + BatDis = Demand + BatChg
            </div>
          </div>

          <div className="p-3 rounded-xl border border-border/80 bg-secondary/40 space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-sans">
              Battery Conservation:
            </span>
            <div className="text-foreground text-[11px] font-medium">
              E_23 = Initial Energy ($E_{`23`} = E_0$)
            </div>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground pt-1">
          Grid exports prohibited &bull; Unused solar curtailed deterministically.
        </p>
      </div>
    </div>
  );
}
