import React from "react";
import { Terminal, ShieldAlert, Cpu, Check, Layers } from "lucide-react";
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Col 1: Service Contract */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <Terminal className="w-4 h-4 text-primary" />
          <h3>API Service Contract</h3>
        </div>
        <div className="space-y-3 font-mono text-xs">
          <div className="p-3 rounded-lg border border-border bg-secondary/30 space-y-1">
            <div className="text-emerald-500 font-bold">GET /health</div>
            <p className="text-muted-foreground text-[11px]">
              Returns HTTP 200 with {`{"status": "ok"}`} when ready.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-border bg-secondary/30 space-y-1">
            <div className="text-primary font-bold">POST /optimize-energy</div>
            <p className="text-muted-foreground text-[11px]">
              Accepts 24h scenario + 1-3 operator notes; returns structured interpretation & 24h plan.
            </p>
          </div>
        </div>

        <div className="text-xs text-muted-foreground pt-2 border-t border-border/40">
          Timeout threshold: <span className="font-mono text-foreground font-semibold">30 seconds</span>
        </div>
      </div>

      {/* Col 2: Supported Directives List */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <Layers className="w-4 h-4 text-amber-500" />
          <h3>Supported Directives (Section 04)</h3>
        </div>

        <div className="space-y-2 text-xs">
          {supportedDirectives.map((d) => (
            <div key={d.name} className="flex items-start gap-2">
              <Badge variant="outline" className="font-mono text-[10px] shrink-0">
                {d.name}
              </Badge>
              <span className="text-muted-foreground text-[11px] leading-tight pt-0.5">
                {d.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Col 3: Mathematical Constraints */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <Cpu className="w-4 h-4 text-sky-400" />
          <h3>Canonical GridWise Math Rules</h3>
        </div>

        <div className="space-y-3 text-xs font-mono">
          <div className="p-3 rounded-lg border border-border bg-secondary/30 space-y-1">
            <span className="text-[11px] text-muted-foreground font-sans font-medium">
              Hourly Energy Balance Equation:
            </span>
            <div className="text-foreground text-[11px] font-semibold leading-relaxed">
              Grid + SolarUsed + BatDis = Demand + BatChg
            </div>
          </div>

          <div className="p-3 rounded-lg border border-border bg-secondary/30 space-y-1">
            <span className="text-[11px] text-muted-foreground font-sans font-medium">
              End-of-Day Neutrality Rule:
            </span>
            <div className="text-foreground text-[11px] font-semibold">
              Final Energy (Hour 23) = Initial Energy (Hour 0)
            </div>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground pt-1">
          Unused solar is curtailed; grid export is not allowed in this challenge.
        </p>
      </div>
    </div>
  );
}
